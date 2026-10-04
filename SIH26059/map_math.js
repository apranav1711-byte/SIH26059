/* Shared pure geometry/time helpers; no network or DOM. */
const MapMath = {
  polar(lon, lat, cx, cy, radius) {
    const angle=lon*Math.PI/180, rho=(90+lat)/35*radius;
    return [cx+rho*Math.sin(angle),cy-rho*Math.cos(angle)];
  },
  advance(position, elapsed, millisecondsPerFrame, count) {
    if(count<2)return 0;
    return (position+Math.min(Math.max(elapsed,0),100)/millisecondsPerFrame)%(count-1);
  },
  interpolate(points, position) {
    const i=Math.max(0,Math.min(points.length-1,Math.floor(position))),j=Math.min(i+1,points.length-1),f=Math.max(0,Math.min(1,position-i));
    return points[i].map((v,k)=>v+(points[j][k]-v)*f);
  }
};
if(typeof module!=='undefined')module.exports=MapMath;
