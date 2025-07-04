class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
			<div class="horiz">
				<img id="pfp" src="/src/pfp.png">
				<div id="name">
					<h2>Stella</h2>
					<h3>any/all</h3>
				</div>
			</div>
			<h1 id="sakura">🌸</h1>
			<div class="horiz" id="pages">
				<a href="https://stardust-kyun.github.io/" target="_self" class="headerLink">Home</a>
				<a href="https://stardust-kyun.github.io/projects/" target="_self" class="headerLink">Projects</a>
                <a href="https://stardust-kyun.github.io/blog/" target="_self" class="headerLink">Blog</a>
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
            <div class="box">
                <a href="https://stardust-kyun.github.io/projects/" target="_self" class="headerLink">Projects</a>
                <li><a href="https://stardust-kyun.github.io/projects/keyboards" target="_self" class="listLink">Keyboards</a></li>
                <a>My custom built keyboards</a>
                <li><a href="https://stardust-kyun.github.io/projects/desktop" target="_self" class="listLink">Desktop</a></li>
                <a>My personal desktop written in lua</a>
                <li><a href="https://stardust-kyun.github.io/projects/awm" target="_self" class="listLink">AwesomeWM Dotfiles</a></li>
                <a>A collection of repositories for awm</a>
                <li><a href="https://stardust-kyun.github.io/projects/awmguide" target="_self" class="listLink">AwesomeWM Guide</a></li>
                <a>A series of tutorials for awm</a>
            </div>
            <div class="box">
                <a href="https://stardust-kyun.github.io/blog/" target="_self" class="headerLink">Blog</a>
                <li><a href="https://stardust-kyun.github.io/blog/first" target="_self" class="listLink">First Post</a></li>
                <a>My experience writing this website</a>
                <li><a href="https://stardust-kyun.github.io/blog/icons" target="_self" class="listLink">Desktop Icons</a></li>
                <a>Documenting a simple way to add desktop icons</a>
                <li><a href="https://stardust-kyun.github.io/blog/2024" target="_self" class="listLink">Best of 2024</a></li>
                <a>An opinionated list of the best rices of 2024</a>
                <li><a href="https://stardust-kyun.github.io/blog/manga" target="_self" class="listLink">Manga Reviews</a></li>
                <a>Reviews of various manga I've enjoyed</a>
            </div>
        `;
    }
}

customElements.define('sidebar-component', Sidebar);

class Contact extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="box">
                <a class="headerText">Contact</a>
                <li>Github</li>
                <a href="https://github.com/stardust-kyun/" target="_blank" class="link">Stardust-kyun</a>
                <li>Discord</li>
                <a href="https://discord.com/users/417133059654156299" target="_blank" class="link">stardustkyun</a>
                <li>Matrix</li>
                <a href="https://matrix.to/#/@stardust-kyun:matrix.org" target="_blank" class="link">stardust-kyun:matrix.org</a>
                <li>Email</li>
                <a href="mailto:stardust-kyun@proton.me" target="_blank" class="link">stardust-kyun@proton.me</a>
            </div>
        `;
    }
}

customElements.define('contact-component', Contact);

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
			<a href=${link} target="_blank" class="headerLink listheader">#${rank}: ${name}</a>
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
			<a href=${link} target="_blank" class="headerLink listheader">#${rank}: ${name}</a>
            <img src=${image} onclick="window.open(this.src)" draggable="false" class="listContent">
        `;
    }
}

customElements.define('list-image', listImage);
