const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.translate(canvas.width / 2, canvas.height / 2);

class Universe {
	static gravitationalConstant = 1;
	static timeStep = 1;
	static debug = true;
}

class Body {
	static #id = 1;
	
	name = `body ${Body.#id++}`;
	position = new Vector2(0, 0);
	velocity = new Vector2(0, 0);
	color = "#FFFFFF";
	restitution = 1;
	radius = 0;
	mass = 0;

	constructor(init) {
		Object.assign(this, init);
	}

	update(bodies) {
		bodies.forEach((other) => {
			if (this === other) return;
			
			const distanceSquared = Vector2.subtract(other.position, this.position).magnitude ** 2;
			const direction = Vector2.normalize(Vector2.subtract(other.position, this.position));
			const force = direction.clone().multiply(Universe.gravitationalConstant).multiply(this.mass).multiply(other.mass).divide(distanceSquared);
			const acceleration = Vector2.divide(force, this.mass);
			
			this.velocity.add(Vector2.multiply(acceleration, Universe.timeStep));
		}); 

		this.position.add(Vector2.multiply(this.velocity, Universe.timeStep));
	}

	render(ctx) {
		const { x, y } = View.target === this ? Vector2.origin : Vector2.add(this.position, View.target.position);

		ctx.beginPath();
		
		ctx.arc(x, y, this.radius, 0, Math.PI * 2, false);
		
		ctx.closePath();
		
		ctx.fillStyle = this.color;
		ctx.fill();
		
		if (Universe.debug) {
			ctx.textAlign = "center";
			
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(`pos: (${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)})`, x, y - this.radius - 10 - 14);
			ctx.fillText(`vel: (${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(2)})`, x, y - this.radius - 10 - 0);
		}
	}
}

class View {
	static ORIGIN = { name: "origin", position: Vector2.origin };
	
	static target = View.ORIGIN;

	/*
	static bodies = [
		new Body({ radius: 10, mass: 10, position: new Vector2(-100, 0) }),
		new Body({ radius: 10, mass: 10, position: new Vector2(100, 0) }),
	];
	*/
	
	static bodies = [
		new Body({ radius: 25, mass: 1000, position: Vector2.origin, velocity: Vector2.up.multiply(0.003) }),
		new Body({ radius: 5, mass: 1, position: new Vector2(100, 0), velocity: Vector2.down.multiply(3) }),
	];
	
	static render(ctx) {
		ctx.save();
		
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.font = "16px sans-serif";

		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(`now watching: ${this.target.name}`, 0, 0);
		
		ctx.restore();
	}
}

function update() {
	ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
	
	View.bodies.forEach((body) => {
		body.update(View.bodies);

		body.render(ctx);
	});
	
	View.render(ctx);
	
	requestAnimationFrame(update);
}

requestAnimationFrame(update);

document.addEventListener("keydown", (e) => {
	if (e.key === "Tab") {
		e.preventDefault();
		
		const list = [View.ORIGIN, ...View.bodies];
		
		const index = list.indexOf(View.target);
		
		View.target = list[(index + 1) % list.length];

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		
		ctx.translate(canvas.width / 2, canvas.height / 2);
	}
});

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	ctx.translate(canvas.width / 2, canvas.height / 2);
});