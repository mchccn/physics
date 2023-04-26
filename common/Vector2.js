class Vector2 {
    static ORDER = 2;

    constructor(x, y) {
        this.coords = [x ?? 0, y ?? 0];
    }

    *[Symbol.iterator]() {
        yield* this.coords;
    }

    add(x, y) {
        if (Vector2.isVector2(x)) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y ?? x;
        }

        return this;
    }

    subtract(x, y) {
        if (Vector2.isVector2(x)) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y ?? x;
        }

        return this;
    }

    multiply(x, y) {
        if (Vector2.isVector2(x)) {
            this.x *= x.x;
            this.y *= x.y;
        } else {
            this.x *= x;
            this.y *= y ?? x;
        }

        return this;
    }

    divide(x, y) {
        if (Vector2.isVector2(x)) {
            this.x /= x.x;
            this.y /= x.y;
        } else {
            this.x /= x;
            this.y /= y ?? x;
        }

        return this;
    }

    negate() {
        return this.multiply(-1);
    }

    angleTo(vector) {
        return Math.acos(
            (this.dot(vector) / this.magnitude) * vector.magnitude
        );
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    get min() {
        return Math.min(...this.coords);
    }

    get max() {
        return Math.max(...this.coords);
    }

    normalize() {
        return this.divide(this.magnitude);
    }

    equals(vector) {
        return vector.x === this.x && vector.y === this.y;
    }

    toString() {
        return `Vector2 (${this.coords.join(", ")})`;
    }

    clone() {
        return new Vector2(...this.coords);
    }

    toArray() {
        return [...this.coords];
    }

    toPoint() {
        const { x, y } = this;
        return { x, y };
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get length() {
        return this.magnitude;
    }

    get x() {
        return this.coords[0];
    }

    set x(v) {
        this.coords[0] = v;
    }

    get y() {
        return this.coords[1];
    }

    set y(v) {
        this.coords[1] = v;
    }

    get 0() {
        return this.coords[0];
    }

    set 0(v) {
        this.coords[0] = v;
    }

    get 1() {
        return this.coords[1];
    }

    set 1(v) {
        this.coords[1] = v;
    }
		
	static get zero() {
		return new Vector2(0, 0);	
	}
		
	static get origin() {
		return new Vector2(0, 0);	
	}
		
    static get up() {
        return new Vector2(0, 1);
    }

    static get down() {
        return new Vector2(0, -1);
    }

    static get left() {
        return new Vector2(-1, 0);
    }

    static get right() {
        return new Vector2(1, 0);
    }

    static lerp(a, b, t) {
        if (t < 0 || t > 1)
            throw new RangeError("t in lerp(a, b, t) is between 0 and 1 inclusive");
        
		const lerp = (a, b, t) => (1 - t) * a + t * b;
		
        return new Vector2(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
    }

    static add(a, b) {
        return a.clone().add(b);
    }

    static subtract(a, b) {
        return a.clone().subtract(b);
    }

    static multiply(a, b) {
        return a.clone().multiply(b);
    }

    static divide(a, b) {
        return a.clone().divide(b);
    }

    static negate(vector) {
        return vector.clone().negate();
    }

    static angleTo(a, b) {
        return a.angleTo(b);
    }

    static normalize(vector) {
        return vector.clone().normalize();
    }

    static isVector2(v) {
        return v instanceof Vector2;
    }
}
