

export class Manoeuvre{
  constructor(
    readonly entry_line: Record<string, any>,
    readonly elements: any[], 
    readonly exit_line: Record<string, any>,
    readonly uid: string
  ) {}

  static parse(data: Record<string, any>) {
    return new Manoeuvre(
      data.entry_line,
      data.elements,
      data.exit_line,
      data.uid
    );
  }

  getEl (elName: string|null, includeEntry: boolean=true) {
    const elnames = this.elements.map(el=>el.uid);
    if (elName == 'entry_line') {
      return includeEntry ? this.entry_line : null;
    } else if (elName != null) {
      return this.elements[elnames.indexOf(elName)];
    } else {
      return null;
    }
  }
  
  elInfo(name: string) {
    const el = Manoeuvre.remove_ret('scoring', this.getEl(name));
  
    function format(input: any) {
      if (typeof input == 'number') {
        return input.toFixed(2)
      } else {
        return String(input)
      }
    }
  
    return Object.entries(el).map(
      row=>String(row[0]) + '=' + format(row[1])
    );
  }
  

  static remove_ret(name:string, data: Record<string, any>) {
    let outp: Record<string, any> = {};
    Object.entries(data).forEach(v=>{
      if (v[0] != name) {outp[v[0]] = v[1];}
    });
    return outp;
  }
  


}



