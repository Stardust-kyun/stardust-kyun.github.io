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
			<h2>🌸 Sakura 🌸</h2>
			<div class="horiz pages">
				<a href="https://stardust-kyun.github.io/" target="_self" class="headerlink">Home</a>
				<a href="https://stardust-kyun.github.io/blog/" target="_self" class="headerlink">Blog</a>
				<a href="https://stardust-kyun.github.io/projects/" target="_self" class="headerlink">Projects</a>
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
                <a href="https://stardust-kyun.github.io/projects/" target="_self" class="headerlink">Projects</a>
                <hr>
                <li><a href="https://stardust-kyun.github.io/projects/keyboards" target="_self" class="listlink">Keyboards</a></li>
                <a>My custom built keyboards</a>
                <li><a href="https://stardust-kyun.github.io/projects/desktop" target="_self" class="listlink">Desktop</a></li>
                <a>My personal desktop written in lua</a>
                <li><a href="https://stardust-kyun.github.io/projects/awm" target="_self" class="listlink">AwesomeWM</a></li>
                <a>A collection of repositories for awm</a>
            </div>
            <div class="box">
                <a href="https://stardust-kyun.github.io/blog/" target="_self" class="headerlink">Blog</a>
                <hr>
                <li><a href="https://stardust-kyun.github.io/blog/first" target="_self" class="listlink">First Post</a></li>
                <a>My experience writing this website</a>
                <li><a href="https://stardust-kyun.github.io/blog/icons" target="_self" class="listlink">Desktop Icons</a></li>
                <a>Documenting a simple way to add desktop icons</a>
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
                <a class="headertext">Contact</a>
                <hr>
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