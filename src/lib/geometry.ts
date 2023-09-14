
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



/*
constructs = Table.constructs + Constructs([
    SVar("pos", Point,       ["x", "y", "z"]           , lambda self: P0(len(self))       ), 
    SVar("att", Quaternion,  ["rw", "rx", "ry", "rz"]  , lambda self : Q0(len(self))       ),
    SVar("vel", Point,       ["u", "v", "w"]           , lambda st: P0() if len(st)==1 else st.att.inverse().transform_point(st.pos.diff(st.dt))  ),
    SVar("rvel", Point,       ["p", "q", "r"]           , lambda st: P0() if len(st)==1 else st.att.body_diff(st.dt).remove_outliers(3)  ),
    SVar("acc", Point,       ["du", "dv", "dw"]        , lambda st : P0() if len(st)==1 else st.att.inverse().transform_point(st.att.transform_point(st.vel).diff(st.dt) + PZ(9.81, len(st)))),
    SVar("racc", Point,       ["dp", "dq", "dr"]        , lambda st: P0() if len(st)==1 else st.rvel.diff(st.dt)),
])
*/

export class State {
    manoeuvre: string; element: string;
    constructor(
        readonly t: number, readonly dt: number, 
        readonly x: number, readonly y: number, readonly z: number,
        readonly rw: number, readonly rx: number, readonly ry: number, readonly rz: number,
        readonly u: number, readonly v: number, readonly w: number,
        readonly p: number, readonly q: number, readonly r: number, 
        readonly du: number, readonly dv: number, readonly dw: number, 
        manoeuvre: string='unknown', element: string='unknown'
    ) {this.manoeuvre=manoeuvre; this.element=element;}
    
    static parse(data: Record<string, any>) {
        let st= new State(
            data.t, data.dt,
            data.x, data.y, data.z, 
            data.rw, data.rx, data.ry, data.rz,
            data.u, data.v, data.w,
            data.p, data.q, data.r,
            data.du, data.dv, data.dw
        );
        if ('manoeuvre' in data) {st.manoeuvre = data.manoeuvre}
        if ('element' in data) {st.element = data.element}
        return st;
    }

    static parse_arr(data: Record<string, any>[]) {
        return data.map(st => State.parse(st))
    }

    pos () {return new Point(this.x, this.y, this.z)}
    att () {return new Quaternion(this.rw, this.rx, this.ry, this.rz)}
    vel () {return new Point(this.u, this.v, this.w)}
    rvel () {return new Point(this.p, this.q, this.r)}
    acc () {return new Point(this.du, this.dv, this.dw)}

    body_to_world(p: Point): Point {return this.att().transform_point(p).offset(this.pos());}

    direction () {
        return (+(this.att().transform_point(new Point(1,0,0)).x > 0)) * 2 - 1;
    }

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