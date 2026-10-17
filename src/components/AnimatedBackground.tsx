import { useEffect, useRef, useCallback } from 'react';

/* ─── types ─────────────────────────────────────────── */
interface Particle   { x:number; y:number; vx:number; vy:number; radius:number; opacity:number; opDir:number }
interface Shooter    { x:number; y:number; len:number; speed:number; angle:number; opacity:number; active:boolean; timer:number; maxTimer:number }
interface AuroraLayer{ offset:number; speed:number; amplitude:number; frequency:number; color:string; opacity:number }
interface PlaneData  { t:number; speed:number; scale:number; trail:Array<{x:number;y:number;a:number}>; trailMax:number; active:boolean; delay:number }

/* ─── helpers ───────────────────────────────────────── */
function lerpColor(t: number) {
  // gold → white tint for contrail dots
  return `rgba(232,213,168,${t})`;
}

function drawPlaneShape(ctx: CanvasRenderingContext2D, s: number) {
  // fuselage
  ctx.beginPath();
  ctx.moveTo(s * 2.5, 0);
  ctx.lineTo(-s * 1.8, -s * 0.35);
  ctx.lineTo(-s * 2.5, 0);
  ctx.lineTo(-s * 1.8, s * 0.35);
  ctx.closePath();
  ctx.fill();
  // left wing
  ctx.beginPath();
  ctx.moveTo(-s * 0.2, 0);
  ctx.lineTo(-s * 0.8, -s * 1.7);
  ctx.lineTo(-s * 1.6, -s * 1.4);
  ctx.lineTo(-s * 1.2, 0);
  ctx.closePath();
  ctx.fill();
  // right wing
  ctx.beginPath();
  ctx.moveTo(-s * 0.2, 0);
  ctx.lineTo(-s * 0.8, s * 1.7);
  ctx.lineTo(-s * 1.6, s * 1.4);
  ctx.lineTo(-s * 1.2, 0);
  ctx.closePath();
  ctx.fill();
  // tail fin
  ctx.beginPath();
  ctx.moveTo(-s * 1.8, 0);
  ctx.lineTo(-s * 2.5, -s * 0.9);
  ctx.lineTo(-s * 2.5, 0);
  ctx.closePath();
  ctx.fill();
}

function bezierPoint(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3;
}

function bezierDeriv(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return 3*(u*u*(p1-p0) + 2*u*t*(p2-p1) + t*t*(p3-p2));
}

function drawCompassRose(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  const gold = '#C8A96E';
  const dim  = 'rgba(200,169,110,0.3)';

  // outer circle
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2);
  ctx.strokeStyle = dim; ctx.lineWidth = 0.8; ctx.stroke();

  // inner circle
  ctx.beginPath(); ctx.arc(0, 0, r*0.35, 0, Math.PI*2);
  ctx.strokeStyle = dim; ctx.lineWidth = 0.6; ctx.stroke();

  // cardinal ticks + arrows
  for (let i = 0; i < 8; i++) {
    const a  = (i / 8) * Math.PI * 2;
    const isMajor = i % 2 === 0;
    const len = isMajor ? r : r * 0.6;
    ctx.save();
    ctx.rotate(a);
    if (isMajor) {
      // pointed arrow
      ctx.beginPath();
      ctx.moveTo(0, -r*0.38);
      ctx.lineTo(r*0.08, -len*0.45);
      ctx.lineTo(0, -len);
      ctx.lineTo(-r*0.08, -len*0.45);
      ctx.closePath();
      ctx.fillStyle = i === 0 ? gold : dim;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -r*0.38);
      ctx.lineTo(0, -len);
      ctx.strokeStyle = dim; ctx.lineWidth = 0.8; ctx.stroke();
    }
    ctx.restore();
  }

  // center dot
  ctx.beginPath(); ctx.arc(0, 0, r*0.06, 0, Math.PI*2);
  ctx.fillStyle = gold; ctx.fill();

  ctx.restore();
}

/* ════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════ */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let W = 0, H = 0;

    /* ── Resize ─────────────────────────────────────── */
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    /* ── Stars ──────────────────────────────────────── */
    const STARS = 120;
    const particles: Particle[] = [];
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < STARS; i++) particles.push({
        x: Math.random()*W, y: Math.random()*H,
        vx:(Math.random()-0.5)*0.18, vy:(Math.random()-0.5)*0.18,
        radius: Math.random()*1.2+0.3,
        opacity: Math.random()*0.55+0.1, opDir: Math.random()>0.5?1:-1,
      });
    };

    /* ── Shooting stars ─────────────────────────────── */
    const shooters: Shooter[] = [];
    const mkShooter = (delay=0): Shooter => ({
      x: Math.random()*W, y: Math.random()*H*0.5,
      len: Math.random()*130+60, speed: Math.random()*6+4,
      angle:(Math.random()*30+15)*Math.PI/180,
      opacity:0, active:false, timer:-delay, maxTimer:Math.random()*400+200,
    });
    for (let i=0;i<4;i++) shooters.push(mkShooter(i*4000));

    /* ── Aurora ─────────────────────────────────────── */
    const aurora: AuroraLayer[] = [
      { offset:0,   speed:0.0004, amplitude:0.08, frequency:1.8, color:'#C8A96E', opacity:0.04  },
      { offset:2.1, speed:0.0003, amplitude:0.10, frequency:2.3, color:'#1A3A5C', opacity:0.07  },
      { offset:4.5, speed:0.0005, amplitude:0.07, frequency:1.5, color:'#6B2D8B', opacity:0.035 },
      { offset:1.2, speed:0.00035,amplitude:0.09, frequency:2.8, color:'#2E5090', opacity:0.045 },
    ];

    /* ── Orbs ───────────────────────────────────────── */
    const orbs = [
      { bx:0.15, by:0.3,  r:280, color:'rgba(200,169,110,', op:0.055, spd:0.00018, ph:0    },
      { bx:0.82, by:0.65, r:340, color:'rgba(26,58,92,',    op:0.09,  spd:0.00022, ph:2.1  },
      { bx:0.5,  by:0.8,  r:230, color:'rgba(107,45,139,',  op:0.04,  spd:0.00015, ph:4.3  },
    ];

    /* ── Planes ─────────────────────────────────────── */
    // Two independent planes on cubic bezier paths; paths regenerated per pass
    const makePlane = (delay: number): PlaneData => ({
      t: 0, speed: 0.0009 + Math.random()*0.0005,
      scale: 5 + Math.random()*4,
      trail: [], trailMax: 55,
      active: false, delay,
    });
    const planes: PlaneData[] = [ makePlane(0), makePlane(8000) ];

    // Each plane gets its own cubic bezier control points (regenerated after each pass)
    type BezierPath = { x0:number;y0:number; cx1:number;cy1:number; cx2:number;cy2:number; x1:number;y1:number };
    const planePaths: BezierPath[] = planes.map(() => generatePath());

    function generatePath(): BezierPath {
      // entry from one edge, exit at another
      const side = Math.floor(Math.random()*4);
      let x0,y0,x1,y1;
      if (side===0)      { x0=-60;         y0=Math.random()*H;   x1=W+60;         y1=Math.random()*H; }
      else if (side===1) { x0=W+60;        y0=Math.random()*H;   x1=-60;          y1=Math.random()*H; }
      else if (side===2) { x0=Math.random()*W; y0=-60;           x1=Math.random()*W; y1=H+60; }
      else               { x0=Math.random()*W; y0=H+60;          x1=Math.random()*W; y1=-60;  }
      // control points offset toward center
      const mx=W/2, my=H/2;
      return {
        x0,y0,x1,y1,
        cx1: x0*0.3+mx*0.5+( Math.random()-0.5)*W*0.4,
        cy1: y0*0.3+my*0.5+( Math.random()-0.5)*H*0.4,
        cx2: x1*0.3+mx*0.5+( Math.random()-0.5)*W*0.4,
        cy2: y1*0.3+my*0.5+( Math.random()-0.5)*H*0.4,
      };
    }

    /* ── Compass roses ──────────────────────────────── */
    const compasses = [
      { x:0.88, y:0.12, r:42, rot:0, speed:0.00008, opacity:0.09 },
      { x:0.07, y:0.82, r:28, rot:1.2, speed:-0.00006, opacity:0.07 },
    ];

    /* ── Ripple rings (touch/click feedback) ────────── */
    interface Ripple { x:number; y:number; r:number; maxR:number; alpha:number }
    const ripples: Ripple[] = [];
    const onPointerDown = (e: PointerEvent) => {
      ripples.push({ x:e.clientX, y:e.clientY, r:0, maxR:120, alpha:0.4 });
    };
    window.addEventListener('pointerdown', onPointerDown);

    let time = 0;
    resize();
    initParticles();
    window.addEventListener('resize', () => { resize(); initParticles(); });

    /* ═══ DRAW FUNCTIONS ════════════════════════════════ */

    const drawBg = () => {
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,  '#050B14');
      g.addColorStop(0.5,'#080E18');
      g.addColorStop(1,  '#060C15');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    };

    const drawOrbs = () => orbs.forEach(o => {
      const breathe = Math.sin(time*o.spd*Math.PI*2000+o.ph)*0.015;
      const cx = o.bx*W + Math.sin(time*o.spd*1500+o.ph)*W*0.04;
      const cy = o.by*H + Math.cos(time*o.spd*1800+o.ph)*H*0.03;
      const op = o.op+breathe;
      const g  = ctx.createRadialGradient(cx,cy,0,cx,cy,o.r);
      g.addColorStop(0,  `${o.color}${(op*1.5).toFixed(3)})`);
      g.addColorStop(0.5,`${o.color}${op.toFixed(3)})`);
      g.addColorStop(1,  `${o.color}0)`);
      ctx.save(); ctx.globalAlpha=1;
      ctx.beginPath(); ctx.arc(cx,cy,o.r,0,Math.PI*2);
      ctx.fillStyle=g; ctx.fill(); ctx.restore();
    });

    const drawAurora = () => aurora.forEach(l => {
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,  'transparent');
      g.addColorStop(0.3,`${l.color}${Math.round(l.opacity*255).toString(16).padStart(2,'0')}`);
      g.addColorStop(0.6,'transparent');
      g.addColorStop(1,  'transparent');
      ctx.save();
      ctx.beginPath();
      for(let s=0;s<=80;s++){
        const x=(s/80)*W;
        const w = Math.sin(s/80*Math.PI*l.frequency+time*l.speed*6000+l.offset)*l.amplitude*H
                 +Math.sin(s/80*Math.PI*l.frequency*1.7+time*l.speed*5000+l.offset+1)*l.amplitude*0.5*H;
        const y=H*0.35+w;
        s===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
      ctx.fillStyle=g; ctx.fill(); ctx.restore();
    });

    const drawStars = () => {
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0;
        if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        p.opacity+=p.opDir*0.003;
        if(p.opacity>0.75)p.opDir=-1;
        if(p.opacity<0.08)p.opDir=1;
        ctx.save(); ctx.globalAlpha=p.opacity;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
        ctx.fillStyle='#E8D5A8'; ctx.fill(); ctx.restore();
      });
      // constellation lines
      const D=115;
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<D){
            ctx.save(); ctx.globalAlpha=(1-dist/D)*0.11;
            ctx.beginPath();
            ctx.moveTo(particles[i].x,particles[i].y);
            ctx.lineTo(particles[j].x,particles[j].y);
            ctx.strokeStyle='#C8A96E'; ctx.lineWidth=0.5; ctx.stroke(); ctx.restore();
          }
        }
      }
    };

    const drawShooters = () => shooters.forEach((s,idx)=>{
      s.timer++;
      if(!s.active){
        if(s.timer>s.maxTimer){
          s.active=true; s.timer=0;
          s.x=Math.random()*W; s.y=Math.random()*H*0.4;
          s.len=Math.random()*140+60; s.speed=Math.random()*6+4;
          s.angle=(Math.random()*30+15)*Math.PI/180; s.opacity=0;
        }
        return;
      }
      const travel=s.timer/60;
      s.opacity=Math.min(1,travel*3)*Math.max(0,1-(travel-0.6)*4);
      if(s.opacity<=0&&travel>0.6){ s.active=false; s.timer=0; s.maxTimer=Math.random()*600+300; return; }
      const mx=Math.cos(s.angle)*s.speed, my=Math.sin(s.angle)*s.speed;
      s.x+=mx; s.y+=my;
      const tg=ctx.createLinearGradient(s.x-mx*s.len/s.speed,s.y-my*s.len/s.speed,s.x,s.y);
      tg.addColorStop(0,'rgba(255,255,255,0)');
      tg.addColorStop(1,`rgba(232,213,168,${s.opacity*0.9})`);
      ctx.save(); ctx.globalAlpha=s.opacity;
      ctx.beginPath();
      ctx.moveTo(s.x-mx*s.len/s.speed,s.y-my*s.len/s.speed);
      ctx.lineTo(s.x,s.y);
      ctx.strokeStyle=tg; ctx.lineWidth=1.5; ctx.shadowBlur=8; ctx.shadowColor='#C8A96E'; ctx.stroke();
      ctx.beginPath(); ctx.arc(s.x,s.y,1.5,0,Math.PI*2);
      ctx.fillStyle='#fff'; ctx.shadowBlur=14; ctx.shadowColor='#E8D5A8'; ctx.fill();
      ctx.restore();
    });

    const drawPlanes = () => planes.forEach((pl, idx) => {
      const path = planePaths[idx];
      pl.delay -= 16;
      if (pl.delay > 0) return;

      if (!pl.active) { pl.active = true; pl.t = 0; pl.trail = []; }

      pl.t += pl.speed;
      if (pl.t >= 1) {
        pl.t = 0; pl.trail = [];
        planePaths[idx] = generatePath();
        pl.delay = 4000 + Math.random()*6000;
        pl.active = false;
        return;
      }

      const t = pl.t;
      const {x0,y0,cx1,cy1,cx2,cy2,x1,y1} = path;
      const px = bezierPoint(t,x0,cx1,cx2,x1);
      const py = bezierPoint(t,y0,cy1,cy2,y1);
      const dx = bezierDeriv(t,x0,cx1,cx2,x1);
      const dy = bezierDeriv(t,y0,cy1,cy2,y1);
      const angle = Math.atan2(dy, dx);

      // push trail dot
      pl.trail.push({ x:px, y:py, a:t });
      if (pl.trail.length > pl.trailMax) pl.trail.shift();

      // draw dashed contrail dots
      pl.trail.forEach((dot, di) => {
        if (di % 3 !== 0) return;
        const ratio = di / pl.trail.length;
        const r = ratio * 1.6;
        const alpha = ratio * 0.4;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, r, 0, Math.PI*2);
        ctx.fillStyle = '#E8D5A8';
        ctx.fill();
        ctx.restore();
      });

      // draw plane
      const fadeIn  = Math.min(1, t * 8);
      const fadeOut = Math.max(0, 1 - (t - 0.88) * 8);
      const plAlpha = fadeIn * fadeOut;

      ctx.save();
      ctx.globalAlpha = plAlpha * 0.92;
      ctx.translate(px, py);
      ctx.rotate(angle);
      ctx.fillStyle = '#F0EDE8';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#C8A96E';
      drawPlaneShape(ctx, pl.scale);
      ctx.restore();
    });

    const drawCompasses = () => compasses.forEach(c => {
      c.rot += c.speed * 16;
      const cx = c.x * W, cy = c.y * H;
      drawCompassRose(ctx, cx, cy, c.r, c.rot, c.opacity);
    });

    const drawRipples = () => {
      for (let i = ripples.length-1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r  += 3.5;
        rp.alpha -= 0.012;
        if (rp.alpha <= 0) { ripples.splice(i,1); continue; }
        ctx.save();
        ctx.globalAlpha = rp.alpha;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI*2);
        ctx.strokeStyle = '#C8A96E';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // second ring slightly behind
        ctx.globalAlpha = rp.alpha * 0.4;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r * 0.65, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
      }
    };

    /* ═══ RENDER LOOP ═══════════════════════════════════ */
    const render = (ts: number) => {
      time = ts;
      ctx.clearRect(0, 0, W, H);
      drawBg();
      drawOrbs();
      drawAurora();
      drawStars();
      drawShooters();
      drawPlanes();
      drawCompasses();
      drawRipples();
      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'fixed', inset:0, zIndex:0, display:'block', pointerEvents:'none' }}
    />
  );
}
