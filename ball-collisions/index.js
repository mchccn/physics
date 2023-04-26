const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

class Ball {
	radius = 5;
	
	restitution = Math.random();

	mass = 5;

	position = new Vector2(
		Math.random() * (canvas.width - this.radius * 2) + this.radius,
		Math.random() * (canvas.height - this.radius * 2) + this.radius,
	);

	velocity = Vector2.origin;

	constructor() {
		const angle = Math.random() * Math.PI * 2;
		
		this.velocity = new Vector2(Math.cos(angle), Math.sin(angle));
	}
}

const balls = new Array(10).fill().map(() => new Ball());

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	balls.forEach((b1) => {
		const updates = [];
		
		balls.forEach((b2) => {
			if (b1 === b2) return;
	
			const vd = Vector2.subtract(b1.velocity, b2.velocity);
			const pd = Vector2.subtract(b1.position, b2.position);
			
			if (pd.magnitude > b1.radius + b2.radius) return;
			
			if (vd.dot(pd) >= 0) return;
			
			const n1 = Vector2.subtract(b1.position, b2.position);
			const u1 = Vector2.multiply(n1, b1.velocity.dot(n1) / n1.dot(n1));
			const t1 = Vector2.subtract(b1.velocity, u1);

			const n2 = Vector2.subtract(b2.position, b1.position);
			const u2 = Vector2.multiply(n2, b2.velocity.dot(n2) / n2.dot(n2));
			const t2 = Vector2.subtract(b2.velocity, u2);

			const v1 = Vector2.subtract(u2, u1).multiply(b1.restitution * b2.mass).add(Vector2.multiply(u1, b1.mass)).add(Vector2.multiply(u2, b2.mass)).divide(b1.mass + b2.mass);
			const v2 = Vector2.subtract(u1, u2).multiply(b2.restitution * b1.mass).add(Vector2.multiply(u1, b1.mass)).add(Vector2.multiply(u2, b2.mass)).divide(b1.mass + b2.mass);

			updates.push(() => {
				b1.velocity = Vector2.add(t1, v1);
				b2.velocity = Vector2.add(t2, v2);
			});
		});
		
		updates.forEach((update) => update());
		
		b1.position.add(b1.velocity);

		if ((b1.position.x < 0 + b1.radius && b1.velocity.x < 0) || (b1.position.x > canvas.width - b1.radius && b1.velocity.x > 0)) b1.velocity.x *= -b1.restitution;
		if ((b1.position.y < 0 + b1.radius && b1.velocity.y < 0) || (b1.position.y > canvas.height - b1.radius && b1.velocity.y > 0)) b1.velocity.y *= -b1.restitution;
		
		ctx.beginPath();

		ctx.arc(b1.position.x, b1.position.y, b1.radius, 0, Math.PI * 2, false);

		ctx.closePath();
		ctx.fillStyle = "#" + Math.floor((1 - b1.restitution) * 255).toString(16).repeat(3);
		ctx.fill();	
		ctx.stroke();
	});

	requestAnimationFrame(update);
}

requestAnimationFrame(update);