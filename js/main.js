const textToMarkdown = (input) => {
	return input
		.replace(/\#\# (.*?)(\n|$)/g, '<h2>$1</h2>')
		.replace(/\# (.*?)(\n|$)/g, '<h1>$1</h1>')
		.replace(/\n/g, '<br>')
		.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
		.replace(/\*(.*?)\*/g, '<i>$1</i>')
		.replace(/\|\|(.*?)\|\|/g, '<span class="spoiler">$1</span>')
		.replace(/\[(.*?)\]\((.\S*)\)/g, '<a href="$2" class="link">$1</a>')
}

class Markdown extends HTMLElement {
	constructor() {
		super();
		this._initialized = false;
	}

	connectedCallback() {
		if (this._initialized) return
		this._initialized = true;
		requestAnimationFrame(() => {
			const content = this.innerHTML.trim();
			this.innerHTML = `<div class="text">${textToMarkdown(content)}</div>`;

			const spoilers = this.querySelectorAll('.spoiler');
			spoilers.forEach(spoiler => {
				spoiler.addEventListener('click', () => spoiler.classList.toggle('spoilerActive'));
			});
		});
	}
}

customElements.define('markdown-text', Markdown);

class Header extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = `
			<div class="horiz">
				<img id="pfp" src="/src/pfp.png">
				<div>
					<h2>Stella</h2>
					<h3>any/all</h3>
				</div>
			</div>
			<div id="sakuraLogo">🌸</div>
			<div class="horiz" id="pages">
				<h1><a href="https://stardust-kyun.github.io/" target="_self">Home</a></h1>
				<h1><a href="https://stardust-kyun.github.io/projects/" target="_self">Projects</a></h1>
				<h1><a href="https://stardust-kyun.github.io/blog/" target="_self">Blog</a></h1>
			</div>
		`;
	}
}

customElements.define('header-component', Header);

class Sidebar extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = `
			<div class="box" style="display: flex; flex-flow: column; gap: 15px; overflow: scroll;">
				<div id="pfpContainer">
					<img id="pfp" src="/src/pfp.png">
				</div>
				<div style="display: flex; justify-content: center; gap: 15px">
					<h2 style="font-size: 24px;">Stella</h2>
					<h3 style="font-size: 24px;">any/all</h3>
				</div>
				<div class="horiz" style="justify-content: center;">
					<a href="https://github.com/stardust-kyun/"><img src="/src/github.svg" class="svg"></img></a>
					<a href="https://discord.com/users/417133059654156299"><img src="/src/discord.svg" class="svg"></img></a>
					<a href="mailto:stardust-kyun@proton.me"><img src="/src/email.svg" class="svg"></img></a>
				</div>
				<h1><a href="https://stardust-kyun.github.io/">Home</a></h1>
				<div class="boxAlt">
					<h1 style="padding: 0;"><a href="https://stardust-kyun.github.io/projects/">Projects</a></h1>
					<br>
					<h2><a href="https://stardust-kyun.github.io/projects/awm">AwesomeWM Dotfiles</a><h2>
					<h3>A collection of repositories for awm</h3>
					<br>
					<h2><a href="https://stardust-kyun.github.io/projects/awmguide/">AwesomeWM Guide</a></h2>
					<h3>A series of tutorials for awm</h3>
				</div>
				<div class="boxAlt">
					<h1 style="padding: 0;"><a href="https://stardust-kyun.github.io/blog/">Blog</a></h1>
					<br>
					<h2><a href="https://stardust-kyun.github.io/blog/2024">Best of 2024</a><h2>
					<h3>An opinionated list of the best rices of 2024</h3>
					<br>
					<h2><a href="https://stardust-kyun.github.io/blog/manga">Manga Reviews</a></h2>
					<h3>Reviews of various manga I've enjoyed</h3>
				</div>
			</div>
		`;
	}
}

customElements.define('sidebar-component', Sidebar);

class AwmEntry extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		let id = this.getAttribute('id');
		let link = this.getAttribute('link');
		let name = this.getAttribute('name');
		let creator = this.getAttribute('creator');
		let image = this.getAttribute('image');
		let content = this.getAttribute('content');

		this.innerHTML = `
			<div class="imageWrapper">
				<img src=${image} onclick="window.open(this.src)" draggable="false" class="image">
				<div class="imageContent">
					<div id=${id}>
						<a href=${link} target="_blank" class="link">${name}</a><a> - ${creator}</a><a href="#${id}" target="_self"> 🔗</a>
					</div>
					<p>${content}</p>
				</div>
			</div>	
			<br/>
		`;
	}
}

customElements.define('awm-component', AwmEntry);

class listVideo extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		let rank = this.getAttribute('rank');
		let name = this.getAttribute('name');
		let link = this.getAttribute('link');
		let video = this.getAttribute('video');

		this.innerHTML = `
			<h1><a href=${link} target="_blank">#${rank}: ${name}</a></h1>
			<br>
			<video controls class="listContent"><source src=${video} type="video/mp4"></video>
		`;
	}
}

customElements.define('list-video', listVideo);

class listImage extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		let rank = this.getAttribute('rank');
		let name = this.getAttribute('name');
		let link = this.getAttribute('link');
		let image = this.getAttribute('image');

		this.innerHTML = `
			<h1><a href=${link} target="_blank">#${rank}: ${name}</a></h1>
			<br>
			<img src=${image} onclick="window.open(this.src)" draggable="false" class="listContent">
		`;
	}
}

customElements.define('list-image', listImage);
