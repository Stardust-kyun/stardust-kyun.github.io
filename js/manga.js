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
		this.classList.add(...tagArray.map(tag => tag.toLowerCase().replaceAll(' ', '_')));
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
			<div class="mangaHeader" id=${id}>
				<a href=${link} target="_blank" class="headerLink">${name}</a>
				<a href=#${id} class="headerLink headerAnchor">🔗</a>
			</div>
			<div class="mangaWrapper">
				<img src=${image} onclick="window.open('${link}', '_blank')" draggable="false" class="mangaImage">
				<div class="mangaContent">
					<div class="mangaTagNames"></div>
					<div class="mangaReview collapsed">${content}</div>
				</div>
			</div>	
		`;

		const createTag = (content) => {
			const tagElement = document.createElement('a');
			tagElement.className = 'mangaTagName';
			tagElement.innerText = content;
			tagContainer.appendChild(tagElement);
		}

		const tagContainer = this.querySelector('.mangaTagNames');
		for (const tag of tags.split(',')) {
			createTag(tag);
		}
		createTag(`Rating: ${rating}/10`);

		requestAnimationFrame(() => {
			setTimeout(() => {
				const mangaReview = this.querySelector('.mangaReview');

				if (mangaReview.scrollHeight > mangaReview.clientHeight + 10) {
					const button = document.createElement('button');
					button.className = 'mangaButton';
					button.textContent = 'Show More';
					let expanded = false;
					button.setAttribute('aria-expanded', expanded);

					button.addEventListener('click', () => {
						expanded = !expanded;
						mangaReview.classList.toggle('collapsed', !expanded);
						mangaReview.classList.toggle('expanded', expanded);
						button.textContent = expanded ? 'Show Less' : 'Show More';
						button.setAttribute('aria-expanded', expanded)
					});
					
					mangaReview.after(button);
				}
			}, 0);
		});

		this.classList.add('mangaShow');
	}
}

customElements.define('manga-component', MangaEntry);

// ------------------ Filter Logic ------------------

let tagFilter = [];

const filter = () => {
	const query = searchInput.value.toLowerCase();
	const entries = document.querySelectorAll('manga-component');

	entries.forEach(entry => {
		const name = entry.dataset.name.toLowerCase();
		const alt = (entry.dataset.alt || '').toLowerCase();

		const searchMatch = name.includes(query) || alt.includes(query);

		const tagMatch = tagFilter.every(tag => {
			const safeTag = tag.toLowerCase().replaceAll(' ', '_');
			return entry.classList.contains(safeTag);
		});
		
		entry.classList.toggle('mangaShow', searchMatch && tagMatch);
	});
}

// ------------------ Search Bar ------------------

const searchInput = document.getElementById('mangaSearchInput');
const mangaSearchClear = document.getElementById('mangaSearchClear');
searchInput.value = '';

searchInput.addEventListener('input', () => {
	filter();
});

mangaSearchClear.addEventListener('click', () => {
	searchInput.value = '';
	tagFilter = [];
	tagButtons.forEach(button => button.classList.toggle('active', false));
	filter();
});

// ------------------ Tag Buttons ------------------

const tagButtons = document.querySelectorAll('#mangaTags .mangaTagButton');
tagButtons.forEach(button => {
	button.addEventListener('click', () => {
		const tag = button.dataset.tag;
		const isActive = button.classList.toggle('active');

		if (isActive) {
			tagFilter.push(tag);
		} else {
			const index = tagFilter.indexOf(tag);
			if (index !== -1) tagFilter.splice(index, 1);
		}

		filter();
	});
});

// ------------------ Sorting Entries ------------------

const entries = Array.from(document.querySelectorAll('manga-component'));
entries.sort((a, b) =>
	a.dataset.name.toLowerCase().localeCompare(b.dataset.name.toLowerCase())
);
const box = document.querySelector('.mangaBox');
entries.forEach(entry => box.appendChild(entry));
