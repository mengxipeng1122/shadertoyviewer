#define ITER 30.0
#define DEPTH 2.0
#define TX_SC 0.02

vec3 rx(vec3 v, float a) { return vec3(v.x,v.y*cos(a)+v.z*sin(a),v.z*cos(a)-v.y*sin(a)); }

vec3 is(vec3 p, vec3 d, float y) { return vec3(p.x-(d.x/d.y*(p.y-y)),y,p.z-(d.z/d.y*(p.y-y))); }

vec3 cr(float f) {
    float i;
    vec3 g = vec3(0.,0.,0.), b = vec3(0.2,0.15,0.1), r = vec3(0.8,0.2,0.1),
        y = vec3(0.95,0.85,0.), w = vec3(1.,1.,1.);
    if (f<0.3) { i=f/0.3;
        return vec3(g.r+(b.r-g.r)*i,g.g+(b.g-g.g)*i,g.b+(b.b-g.b)*i); }
    else if (f<0.7) { i=(f-0.3)/0.4;
        return vec3(b.r+(r.r-b.r)*i,b.g+(r.g-b.g)*i,b.b+(r.b-b.b)*i); }
    else if (f<0.9) { i=(f-0.7)/0.2;
        return vec3(r.r+(y.r-r.r)*i,r.g+(y.g-r.g)*i,r.b+(y.b-r.b)*i); }
    else { i=(f-0.9)/0.1;
        return vec3(y.r+(w.r-y.r)*i,y.g+(w.g-y.g)*i,y.b+(w.b-y.b)*i); }
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec4 co = vec4(fragCoord.xy, iResolution.xy), t;
    vec3 sc = mix(vec3(0.8,0.2,0.1),vec3(0.2,0.1,0.05),co.y/co.w*3.-2.),
    rp = vec3(5.,10.,iTime*15.), oc=vec3(0.,0.,0.), p,
    rd = rx(vec3((co.z/co.w)*-0.5+co.x/co.w, -0.5+co.y/co.w, 2.),-0.1);
    
    if (rd.y < 0.)
    {
        for (float i=-DEPTH; i<=.0; i+=(DEPTH/(ITER-1.)))
        {
            p = is(rp, rd, i);
        	t = texture(iChannel0, vec2(p.x*TX_SC,p.z*TX_SC/5.));
            float h = (t.r+t.g+t.b)/3.;
            if ((-DEPTH - i) / -DEPTH < 1.001-h) oc = cr(h);
        }
        fragColor = vec4(mix(oc,sc,pow(clamp(max(distance(p,rp)-20.,0.)/800.,0.,1.),0.7)),1.);
    }
    else fragColor = vec4(sc,1.0);
}
