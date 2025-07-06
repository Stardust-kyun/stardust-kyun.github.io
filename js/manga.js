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
				<div class="mangaContentWrapper">
					<div class="mangaContent">
						<div class="mangaTagNames"></div>
						<div class="mangaReview collapsed">${content}</div>
					</div>
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
				const mangaContent = this.querySelector('.mangaContent');
				
				if (mangaContent.scrollHeight > 300) {
					const button = document.createElement('button');
					button.className = 'mangaButton';
					button.textContent = 'Show More';
					let expanded = false;
					button.setAttribute('aria-expanded', expanded);

					mangaContent.classList.add('collapsible');

					button.addEventListener('click', () => {
						expanded = !expanded;
						mangaContent.classList.toggle('expanded', expanded);
						button.textContent = expanded ? 'Show Less' : 'Show More';
						button.setAttribute('aria-expanded', expanded)
					});
					
					mangaContent.after(button);
				}
			}, 0);
		});

		this.classList.add('mangaShow');
	}
}

customElements.define('manga-component', MangaEntry);

// ------------------ Filter Logic ------------------

let includeTags = [];
let excludeTags = [];

const filter = () => {
	const query = searchInput.value.toLowerCase();
	const entries = document.querySelectorAll('manga-component');
	const box = document.getElementById('mangaBox');
	const noResults = document.getElementById('noResults');
	let anyVisible = false;

	entries.forEach(entry => {
		const name = entry.dataset.name.toLowerCase();
		const alt = (entry.dataset.alt || '').toLowerCase();
		const searchMatch = name.includes(query) || alt.includes(query);

		const includeMatch = includeTags.every(tag => {
			const safeTag = tag.toLowerCase().replaceAll(' ', '_');
			return entry.classList.contains(safeTag);
		});

		const excludeMatch = excludeTags.some(tag => {
			const safeTag = tag.toLowerCase().replaceAll(' ', '_');
			return entry.classList.contains(safeTag);
		});
		
		entry.classList.toggle('mangaShow', searchMatch && includeMatch && !excludeMatch);
	});

	for (const entry of entries) {
		if (entry.classList.contains('mangaShow')) {
			anyVisible = true;
			break;
		}
	};
	box.style.display = anyVisible ? 'grid' : 'none';
	noResults.style.display = anyVisible ? 'none' : 'block';
}

// ------------------ Search Bar ------------------

const searchInput = document.getElementById('mangaSearchInput');
const mangaSearchClear = document.getElementById('mangaSearchClear');
searchInput.value = '';

searchInput.addEventListener('input', () => {
	filter();
});

searchInput.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' || e.key === 'Enter') {
		searchInput.blur();
	}
});

mangaSearchClear.addEventListener('click', () => {
	searchInput.value = '';
	includeTags = [];
	excludeTags = [];
	tagButtons.forEach(button => button.classList.remove('included'));
	tagButtons.forEach(button => button.classList.remove('excluded'));
	filter();
});

// ------------------ Filter Button ------------------

const filterButton = document.getElementById('mangaFilterButton');
const tagContainer = document.getElementById('mangaTags');

filterButton.addEventListener('click', () => {
	const isOpen = tagContainer.classList.toggle('open');
	filterButton.textContent = isOpen ? 'Hide Filters' : 'Show Filters';
});

// ------------------ Tag Buttons ------------------

const tagButtons = document.querySelectorAll('.mangaTagButton');
tagButtons.forEach(button => {
	button.addEventListener('click', () => {
		const tag = button.dataset.tag;

		if (button.classList.contains('included')) {
			button.classList.remove('included');
			button.classList.add('excluded');
			includeTags = includeTags.filter(t => t !== tag);
			if (!excludeTags.includes(tag)) excludeTags.push(tag);
		} else if (button.classList.contains('excluded')) {
			button.classList.remove('excluded');
			excludeTags = excludeTags.filter(t => t !== tag);
		} else {
			button.classList.add('included');
			if (!includeTags.includes(tag)) includeTags.push(tag);
		}

		includeTags = includeTags.filter(t => !excludeTags.includes(t));
		excludeTags = excludeTags.filter(t => !includeTags.includes(t));

		filter();
	});
});

// ------------------ Sorting Entries ------------------

const entries = Array.from(document.querySelectorAll('manga-component'));
entries.sort((a, b) =>
	a.dataset.name.toLowerCase().localeCompare(b.dataset.name.toLowerCase())
);
const box = document.getElementById('mangaBox');
entries.forEach(entry => box.appendChild(entry));

// ------------------ Back To Top ------------------

const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
	if (window.scrollY > 200) {
		backToTop.classList.add('visible');
	} else {
		backToTop.classList.remove('visible');
	}
});

backToTop.addEventListener('click', () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
});
