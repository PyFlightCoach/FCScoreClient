
export class Point {
    x: number; y: number; z: number;
    constructor(x: number, y: number, z: number) {this.x = x; this.y = y; this.z = z;};

    norm(): Point {
        const fac = 1 / Math.sqrt(this.x**2 + this.y**2 + this.z**2)
        return new Point(fac * this.x, fac * this.y, fac * this.z);
    }

    length(): number {return Math.sqrt(this.x**2 + this.y**2 + this.z**2);}

    static dot(a: Point, b: Point): number {return a.x * b.x + a.y * b.y + a.z * b.z;}

    static cross(a: Point, b: Point): Point {
        return new Point(
            a.y * b.z - a.z * b.y, 
            a.z * b.x - a.x * b.z, 
            a.x * b.y - a.y * b.x
        );
    }

    mul (val: number): Point {return new Point(val * this.x, val * this.y, val * this.z);}

    static add (a: Point, b: Point): Point {
        return new Point(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    offset(other: Point): Point {return Point.add(this, other);}

    static sum(ps: Point[]): Point {
        let op = new Point(0,0,0);
        ps.forEach((p) => {op=Point.add(op, p);});
        return op;
    }

}

export class Quaternion {
    w: number; x: number; y: number; z: number;
    constructor(w: number, x: number, y: number, z: number) {
        this.w = w; this.x = x; this.y = y; this.z = z;
    }

    axis(): Point {return new Point(this.x, this.y, this.z);}

    static mul(a: Quaternion, b: Quaternion): Quaternion {
        const pa = a.axis(); const pb = b.axis();
        const w = a.w * b.w - Point.dot(pa, pb);
        const xyz = Point.sum([
            pb.mul(a.w),
            pa.mul(b.w),
            Point.cross(pa, pb)
        ]); 
        return new Quaternion(w, xyz.x, xyz.y, xyz.z)
    }

    norm(): Quaternion {
        const fac = 1 / Math.sqrt(this.w**2 + this.x**2 + this.y**2 + this.z**2)
        return new Quaternion(fac * this.w, fac * this.x, fac * this.y, fac * this.z);
    }
        
    conjugate(): Quaternion {return new Quaternion(this.w, -this.x, -this.y, -this.z);}
        
    inverse(): Quaternion {return this.conjugate().norm();}

    transform_point(p: Point): Point {
        //a, b = Base.length_check(self, point)
        return Quaternion.mul(
            this,
            Quaternion.mul( 
                new Quaternion(0, p.x, p.y, p.z),
                this.inverse()
            )
        ).axis();   
    }       
}


export class State {
    pos: Point; att: Quaternion; manoeuvre: string=""; element: string="";
    constructor(data: Record<string, any>) {
        this.pos = new Point(data.x, data.y, data.z);
        this.att = new Quaternion(data.rw, data.rx, data.ry, data.rz);
        if ('element' in data) this.element=data.element;
        if ('manoeuvre' in data) this.manoeuvre=data.manoeuvre;
//        this.vel = new Point(data.u, data.v, data.w);
//        this.rvel = new Point(data.p, data.q, data.r);
    }

    body_to_world(p: Point): Point {return this.att.transform_point(p).offset(this.pos);}

}


export function split_states(state: State[]) {
    let states: Record<string, State[]> = {};
    state.forEach((st) => {
        if (st.element in states) {
            states[st.element].push(st);
        } else {
            states[st.element] = [st];
        }
    });
    return states
}