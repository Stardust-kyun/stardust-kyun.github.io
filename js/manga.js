// ------------------ Manga Component ------------------

class MangaEntry extends HTMLElement {
    constructor() {
        super();

		this._initialized = false;
		const tags = this.dataset.tags;
		const tagArray = tags
			.split(',')
			.map(t => t.trim())
			.filter(Boolean);
		this.classList.add(...tagArray.map(t => t.toLowerCase().replaceAll(' ', '_')));
    }

    connectedCallback() {
		if (this._initialized) return
		this._initialized = true;

		const link = this.dataset.link;
		const name = this.dataset.name;
		const image = this.dataset.image;
		const tags = this.dataset.tags;
		const rating = this.dataset.rating;
		const id = name.replaceAll(' ', '');

		const content = this.innerHTML
			.replace(/\n/g, '<br>')
			.replace(/\*(.*)\*/g, '<i>$1</i>')
			.replace(/\*\*(.*)\*\*/g, '<b>$1</b>')
			.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="link">$1</a>');


		this.innerHTML = `
			<div class="mangaheader" id=${id}>
				<a href=${link} target="_blank" class="headerlink">${name}</a>
				<a href=#${id} class="headerlink headeranchor">🔗</a>
			</div>
			<div class="mangawrapper">
				<img src=${image} onclick="window.open('${link}', '_blank')" draggable="false" class="mangaimage">
				<div class="mangacontent">
					<div class="mangatagnames"></div>
					<p class="mangareview">${content}</p>
				</div>
			</div>	
		`;

		const createTag = (content) => {
			const tagElement = document.createElement('a');
			tagElement.className = 'mangatagname';
			tagElement.innerText = content;
			tagContainer.appendChild(tagElement);
		}

		const tagContainer = this.querySelector('.mangatagnames');
		for (const tag of tags.split(',')) {
			createTag(tag);
		}
		createTag(`Rating: ${rating}/10`);

		/*
		const mangaContent = this.querySelector('.mangacontent');
		const collapsedHeight = 350;

		mangaContent.style.overflow = 'hidden';
		mangaContent.style.transition = 'max-height 0.3s ease';
		mangaContent.style.maxHeight = `${collapsedHeight}px`;

		if (mangaContent.scrollHeight > collapsedHeight + 10) {
			const button = document.createElement('button');
			button.className = 'readMore';
			button.textContent = 'Read More';
			mangaContent.after(button);

			button.addEventListener('click', () => {
				const isExpanded = mangaContent.classList.toggle('expanded');
				if (isExpanded) {
					mangaContent.style.maxHeight = `${mangaContent.scrollHeight}px`;
					button.textContent = 'Show Less';
				} else {
					mangaContent.style.maxHeight = `${collapsedHeight}px`;
					button.textContent = 'Read More';
				}
			});
		}
		*/
	}
}

customElements.define('manga-component', MangaEntry);

// ------------------ Tag Filter Logic ------------------

const tagFilter = [];

const visibility = (action) => {
	const entries = document.querySelectorAll('.manga');
	entries.forEach(entry => {
		entry.classList.toggle('mangashow', action === 'show');
	});
};
visibility('show');

const filter = () => {
	const entries = document.querySelectorAll('.manga')
	if (tagFilter.length === 0) {
		visibility('show');
		return;
	}
	entries.forEach(entry => {
		const hasAllTags = tagFilter.every(tag => {
			const safeTag = tag.toLowerCase().replaceAll(' ', '_');
			return entry.classList.contains(safeTag);
		});
		entry.classList.toggle('mangashow', hasAllTags);
	});
}

// ------------------ Button Events ------------------

const buttons = document.querySelectorAll('#mangatags .mangabutton');
buttons.forEach(button => {
	button.addEventListener('click', () => {
		const tag = button.getAttribute('tag');
		const isActive = button.classList.toggle('active');
		if (isActive) {
			tagFilter.push(tag);
		} else {
			const index = tagFilter.indexOf(tag);
			if (index !== -1) tagFilter.splice(index, 1);
		}

		visibility('hide');
		filter();
	});
});

// ------------------ Sorting Entries ------------------

const entries = Array.from(document.querySelectorAll('.manga'));
entries.sort((a, b) =>
	a.dataset.name.toLowerCase().localeCompare(b.dataset.name.toLowerCase())
);
const box = document.querySelector('.mangabox');
entries.forEach(entry => box.appendChild(entry));
