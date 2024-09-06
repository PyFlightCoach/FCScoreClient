import {min, max, sum, mean} from '$lib/arrays';

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

    mul (val: number|Point): Point {
        if (typeof(val) == 'number') {
            return new Point(val * this.x, val * this.y, val * this.z);
        } else if (typeof(val) == typeof(this)) {
            return new Point(val.x * this.x, val.y * this.y, val.z * this.z);
        } else {
            throw new Error('Invalid type for Point.mul')
        }
    }
    
    div(val: number|Point) {
        if (typeof val == 'number') {
            return new Point(this.x / val, this.y / val, this.z / val);
        } else if (typeof(val) == typeof(this)) {
            return new Point(this.x / val.x, this.y / val.x, this.z / val.z);
        } else {
            throw new Error('Invalid');
        }
    }

    static add (a: Point, b: Point): Point {
        return new Point(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    offset(other: Point): Point {return Point.add(this, other);}

    static sum(ps: Point[]): Point {return new Points(ps).sum();}

    static distance(a: Point, b: Point) {
        return new Point(b.x - a.x, b.y - a.y, b.z - a.z);
    }

    cos(): Point {
        return new Point(Math.cos(this.x), Math.cos(this.y), Math.cos(this.z));
    }

    sin(): Point {
        return new Point(Math.sin(this.x), Math.sin(this.y), Math.sin(this.z));
    }   

}

export class Points {
    data: Point[] = [];
    constructor(data: Point[]) {this.data=data;}
    x () {return this.data.map((p) => p.x)}
    y () {return this.data.map((p) => p.y)}
    z () {return this.data.map((p) => p.z)}
    mean () {return new Point(mean(this.x()), mean(this.y()), mean(this.z()))}
    norm () {return this.data.map((p) => p.norm())}
    length () {return this.data.map((p) => p.length())}
    min () {return new Point(min(this.x()), min(this.y()), min(this.z()))}
    max () {return new Point(max(this.x()), max(this.y()), max(this.z()))}
    range() { return new Points([this.min(), this.max()])}
    sum() {return new Point(sum(this.x()), sum(this.y()), sum(this.z()))}
    
    static concat(ps: Points[]) {
        const ops: Point[] = [];
        ps.forEach(p => ops.push(...p.data));
        return new Points(ops);
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
    
    static parse_euler(eul: Point): Quaternion {
        const half = eul.mul(0.5);
        const c = half.cos();
        const s = half.sin();

        return new Quaternion(
                c.y * c.z * c.x + s.y * s.z * s.x,
                c.y * c.z * s.x - s.y * s.z * c.x,
                s.y * c.z * c.x + c.y * s.z * s.x,
                c.y * s.z * c.x - s.y * c.z * s.x            
        );
    }
}


const LOCFAC = 111318.84502145034
export class GPS {
    constructor(readonly lat: number, readonly lon: number, readonly alt: number) {}
    static parse(data: Record<string, any>) {
        return new GPS(data.lat, data.lon, data.alt);
    }
    static parse_arr(data: Record<string, any>[]) {
        return data.map(gps => GPS.parse(gps));
    }
    offset(pin: Point) {
        const latb = this.lat + pin.x / LOCFAC
        
        return new GPS(
            latb,
            this.lon + pin.y / (LOCFAC * Math.max(Math.cos(latb * Math.PI / 180), 0.01)),
            this.alt - pin.z
        )
    }

    static sub(a: GPS, b: GPS) {
        return new Point(
            (a.lat - b.lat) * LOCFAC,
            (a.lon - b.lon) * LOCFAC * Math.max(Math.cos(a.lat * Math.PI / 180), 0.01),
            b.alt - a.alt
        )
    }

}


export class State {
    manoeuvre: string; element: string;
    constructor(
        readonly t: number, readonly dt: number, 
        readonly x: number, readonly y: number, readonly z: number,
        readonly rw: number, readonly rx: number, readonly ry: number, readonly rz: number,
        readonly u: number, readonly v: number, readonly w: number,
        readonly p: number, readonly q: number, readonly r: number, 
        readonly du: number, readonly dv: number, readonly dw: number, 
        manoeuvre: string|undefined=undefined, element: string|undefined=undefined
    ) {this.manoeuvre=manoeuvre; this.element=element;}

    static parse(data: Record<string, any>) {
        let st= new State(
            data.t, data.dt,
            data.x, data.y, data.z, 
            data.rw, data.rx, data.ry, data.rz,
            data.u, data.v, data.w,
            data.p, data.q, data.r,
            data.du, data.dv, data.dw,
            data.manoeuvre, data.element
        );
        return st;
    }

    static parse_fcj(data: Record<string, any>, parameters: Record<string, number>) {
        
        const pilotPos = new GPS(
            parameters.pilotLat, 
            parameters.pilotLon, 
            parameters.pilotAlt
        );
        const pilotRot = Quaternion.parse_euler(
            new Point(
                Math.PI, 
                0, 
                parameters.rotation
        ));
        
        const q = Quaternion.parse_euler((new Point(data.r, data.p, data.yw)).mul(Math.PI / 180));
        return State.build(
            new Point(data.x, data.y, data.z),
            Quaternion.mul(pilotRot, q),
            q.inverse().transform_point(pilotRot.transform_point(new Point(data.u, data.v, data.w))),
        )
    }

    static build(
        pos: Point, att: Quaternion, 
        vel: Point=new Point(0,0,0), rvel: Point=new Point(0,0,0), 
        acc: Point=new Point(0,0,0), 
        t: number=0, dt: number=1/30, 
        manoeuvre: string|undefined=undefined, element: string|undefined=undefined
    ) {
        return new State(
            t, dt,
            pos.x, pos.y, pos.z,
            att.w, att.x, att.y, att.z,
            vel.x, vel.y, vel.z,
            rvel.x, rvel.y, rvel.z,
            acc.x, acc.y, acc.z,
            manoeuvre, element
        )
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


export class States {
    data: State[];
    constructor(data: State[]) {this.data=data;}

    static parse (data: Record<string, any>[] | Record<string, Record<string, any[]>>): States{
        return new States((data.hasOwnProperty('data') ? data.data : data).map(st => State.parse(st)))
    }

    getFCJIndexOffset(minalt=10) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].z > minalt) {
                return i;
            }
        }
    }

    pos () {return this.data.map(state => state.pos())}
    att () {return this.data.map(state => state.att())}
    vel () {return this.data.map(state => state.vel())}
    rvel () {return this.data.map(state => state.rvel())}
    acc () {return this.data.map(state => state.acc())}
    manoeuvre () {return this.data.map(state => state.manoeuvre)}
    element () {return this.data.map(state => state.element)}
    body_to_world (p: Point)  {return this.data.map((st) => st.body_to_world(p))}

    range (col:string) {
        return [
            Math.min.apply(0, this.data.map((st) => st[col])) , 
            Math.max.apply(0, this.data.map((st) => st[col])) 
        ];
    }

    centre (col:string) {
        const srange = this.range(col);
        return (srange[0] + srange[1]) / 2;
    }

    split() {
        let states: Record<string, States> = {};
        let last_el = '';
        this.data.forEach((st) => {
            if (st.element in states) {
                states[st.element].data.push(st);
            } else {
                if (last_el != '') {
                    states[last_el].data.push(st);
                }
                last_el = st.element;
                states[st.element] = new States([st]);
            }
        });
        return states;
    }

    downsample (n:number) {
        //reduce a list of states to n equally spaced ones, include the first and last ones
        const spacing = Math.floor(this.data.length / (n - 1));
        const sts = [];
        for (let i = 0; i <= n - 2; i++) {
            sts.push(this.data[i * spacing]);
        }
        if (n >= 1) {
            sts.push(this.data[this.data.length - 1]);
        }
        return new States(sts);
    };
    
    elements() {
        return [...new Set(this.element())];
    }    

    end_info() {
        const all_elements = this.element();
        return Object.fromEntries(this.elements().map((el) => {
            const lastid = all_elements.lastIndexOf(el);
            const firstid = all_elements.indexOf(el);
            return [
                el, 
                {
                    lastid,
                    lastt: this.data[lastid].t, 
                    firstid, 
                    firstt:this.data[firstid].t
                }];
        }));
    }

}



export function state_range(state: State[], col: string, extend: number = 0) {
    return [
        Math.min.apply(0, state.map((st) => st[col])) , 
        Math.max.apply(0, state.map((st) => st[col])) 
    ];
}

export function state_centre(state: State[], col: string) {
    const srange = state_range(state, col);
    return (srange[0] + srange[1]) / 2
}

export function state_multi(state: State[], cols: string[], func: any) {
    let ranges: Record<string, number> = {};
    cols.forEach((col) => {
        ranges[col] = func(state, col);
    });
    return ranges;
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