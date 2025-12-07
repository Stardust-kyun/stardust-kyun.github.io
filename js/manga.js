// ------------------ Helpers ------------------

const normalize = (content) => {
	return content
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, '_')
		.replace(/^_+|_+$/g, '')
		.replace(/_+/g, '_');
}

// ------------------ Manga Component ------------------

class MangaEntry extends HTMLElement {
	constructor() {
		super();
		this._initialized = false;
		this._rawContent = this.innerHTML;

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
		const id = normalize(name);
		const content = this._rawContent;

		this.innerHTML = `
			<div class="mangaHeader" id=${id}>
				<h1><a href=${link} target="_blank">${name}</a></h1>
				<div class="headerAnchor">
					<h1><a href=#${id}>🔗</a></h1>
					<button class="mangaHeaderButton" data-name="${name}">⭐</button>
				</div>
			</div>
			<div class="mangaWrapper">
				<img src=${image} onclick="window.open('${link}', '_blank')" draggable="false" class="mangaImage">
				<div class="mangaContentWrapper">
					<div class="mangaContent">
						<div class="mangaTagNames"></div>
						<markdown-text class="mangaReview collapsed">${content}</markdown-text>
					</div>
				</div>
			</div>	
		`;

		const createTag = (content) => {
			const tagElement = document.createElement('div');
			tagElement.classList.add('mangaTagName', `${content.replaceAll(' ', '_')}`);
			tagElement.innerText = content;
			tagContainer.appendChild(tagElement);
		}

		const tagContainer = this.querySelector('.mangaTagNames');
		for (const tag of tags.split(',')) {
			createTag(tag);
		}
		createTag(`Rating: ${rating}/10`);

		const imgElement = this.querySelector('img');

		const runAfterImage = () => {
			const mangaContent = this.querySelector('.mangaContent');
			const mangaContentWrapper = this.querySelector('.mangaContentWrapper');
			
			if (mangaContent.scrollHeight > imgElement.scrollHeight) {
				mangaContent.style.maxHeight = `${imgElement.scrollHeight-52}px`;
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
					if (expanded) {
						mangaContent.style.maxHeight = "1500px";
					} else {
						mangaContent.style.maxHeight = `${imgElement.scrollHeight-52}px`;
					}
				});
				
				mangaContent.after(button);
			}
		}

		if (imgElement.complete) {
			runAfterImage();
		} else {
			imgElement.addEventListener('load', runAfterImage);
		}
	}
}

customElements.define('manga-component', MangaEntry);

// ------------------ Filter Logic ------------------

let includeTags = [];
let excludeTags = [];
let filteredEntries = [];
let ratingCounts = new Array(10).fill(0);
let loaded = false;

const box = document.getElementById('mangaBox');
const entries = document.querySelectorAll('manga-component');
const ratingBars = document.querySelectorAll('.mangaRatingBar');

const pageLength = 10;
let currentPage = 1;
let totalPages, start, end;
const updateVisible = () => {
	totalPages = Math.ceil(filteredEntries.length / pageLength);
	start = (currentPage - 1) * pageLength;
	if (start + pageLength > filteredEntries.length) {
		end = filteredEntries.length;
	} else {
		end = start + pageLength;
	}
	const pageEntries = filteredEntries.slice(start, end);

	box.replaceChildren(...pageEntries);
	document.getElementById('pageName').innerText = start + "-" + end + " of " + filteredEntries.length;

	ratingBars.forEach(bar => {
		bar.style.height = '22px';
		if (ratingCounts[bar.dataset.rating-1] != 0) {
			bar.style.height = `${bar.scrollHeight+ratingCounts[bar.dataset.rating-1]/Math.max(...ratingCounts)*150}px`;
			bar.style.backgroundColor = 'var(--fg)';
			bar.style.color = 'var(--bg)';
		} else {
			bar.style.backgroundColor = 'var(--bg)';
			bar.style.color = 'var(--fg)';
		}
		bar.innerHTML = ratingCounts[bar.dataset.rating-1];
	});
}

const jumpToAnchor = () => {
	const hash = window.location.hash;
	if (!hash || !hash.startsWith('#')) return;

	const anchorId = hash.slice(1);
	const targetEntry = filteredEntries.find(entry => {
		const id = entry.querySelector('.mangaHeader')?.id;
		return id === anchorId;
	});

	if (targetEntry) {
		const index = filteredEntries.indexOf(targetEntry);
		const page = Math.floor(index / pageLength) + 1;

		if (page !== currentPage) {
			currentPage = page;
			updateVisible();
		}
		requestAnimationFrame(() => {
			const anchorElement = document.getElementById(anchorId);
			anchorElement.scrollIntoView({ behavior: 'smooth' });
		});
	}
};

const filter = () => {
	const query = searchInput.value.toLowerCase();
	const noResults = document.getElementById('noResults');
	let anyVisible = false;
	filteredEntries = [];
	ratingCounts = new Array(10).fill(0);
	currentPage = 1;

	entries.forEach(entry => {
		const name = entry.dataset.name.toLowerCase();
		const alt = (entry.dataset.alt || '').toLowerCase();
		const searchMatch = name.includes(query) || alt.includes(query);

		const includeMatch = includeTags.every(tag => {
			const safeTag = normalize(tag);
			return entry.classList.contains(safeTag);
		});

		const excludeMatch = excludeTags.some(tag => {
			const safeTag = normalize(tag);
			return entry.classList.contains(safeTag);
		});
		
		let customMatch = true;
		if (customList.length) {
			customMatch = customList.includes(entry.dataset.name);
		}
	
		if (searchMatch && includeMatch && customMatch && !excludeMatch) {
			filteredEntries.push(entry);
			ratingCounts[entry.dataset.rating-1] += 1;
		}
	});

	if (currentSort === 'alphabetical') {
		filteredEntries.sort((a, b) => a.dataset.name.toLowerCase().localeCompare(b.dataset.name.toLowerCase()));
	} else if (currentSort === 'rating') {
		filteredEntries.sort((a, b) => Number(b.dataset.rating) - Number(a.dataset.rating));
	} else if ( currentSort === 'upload') {
		filteredEntries.reverse();
	}

	updateVisible();

	if (filteredEntries.length > 0) {
		anyVisible = true;
	}

	box.style.display = anyVisible ? 'grid' : 'none';
	noResults.style.display = anyVisible ? 'none' : 'block';

	if (!loaded) {
		jumpToAnchor();
		loaded = true;
	}
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
	customList = [];
	tagButtons.forEach(button => button.classList.remove('included'));
	tagButtons.forEach(button => button.classList.remove('excluded'));
	mangaHeaderButtons.forEach(button => button.classList.remove('selected'));
	currentSort = defaultSort;
	mangaSortButtons.forEach(button => {
		button.classList.remove('selected');
		if (button.dataset.sort === currentSort) button.classList.add('selected');
	});
	filter();
	updateURLFilters();
});

// ------------------ Filter Button ------------------

const filterButton = document.getElementById('mangaFilterButton');
const tagContainer = document.getElementById('mangaTags');

filterButton.addEventListener('click', () => {
	const isOpen = tagContainer.classList.toggle('open');
	filterButton.textContent = isOpen ? 'Hide Filters' : 'Show Filters';
});

// ------------------ Rating Explanation Button ------------------

const ratingExplanationButton = document.getElementById('ratingExplanationButton');
const ratingExplanation = document.getElementById('ratingExplanation');

ratingExplanationButton.addEventListener('click', () => {
	const isOpen = ratingExplanation.classList.toggle('open');
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
		updateURLFilters();

		filter();
	});
});

// ------------------ Sorting Entries ------------------

const defaultSort = 'upload';
let currentSort = defaultSort;

const mangaSortButtons = document.querySelectorAll('.mangaSortButton');
mangaSortButtons.forEach(button => {
	if (button.dataset.sort === currentSort) button.classList.add('selected');
	button.addEventListener('click', () => {
		currentSort = button.dataset.sort;

		mangaSortButtons.forEach(btn => btn.classList.remove('selected'));
		button.classList.add('selected');

		updateURLFilters();

		filter();
	});
});

// ------------------ Custom List Button ------------------

let customList = [];

const mangaHeaderButtons = document.querySelectorAll('.mangaHeaderButton');
mangaHeaderButtons.forEach(button => {
	button.addEventListener('click', () => {
		const active = button.classList.toggle('selected');
		const name = button.dataset.name;

		if (active) {
			customList.push(name);
		} else {
			customList = customList.filter(n => n !== name);
		}
		updateURLFilters();
	});
});

// ------------------ Back To Top ------------------
/*
const backToTop = document.getElementById('backToTop');
const main = document.getElementById('main');

window.addEventListener('scroll', () => {
	if (window.scrollY > 200) {
		backToTop.classList.add('visible');
	} else {
		backToTop.classList.remove('visible');
	}
});
main.addEventListener('scroll', () => {
	if (main.scrollTop > 200) {
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
	main.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
});
*/
// ------------------ Page Buttons ------------------

const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
	main.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}

document.getElementById('pageStart').addEventListener('click', () => {
	if (currentPage > 1) {
		currentPage = 1;
		updateVisible();
		scrollToTop();
	}
});
document.getElementById('pageBack').addEventListener('click', () => {
	if (currentPage > 1) {
		currentPage -= 1;
		updateVisible();
		scrollToTop();
	}
});
document.getElementById('pageNext').addEventListener('click', () => {
	if (currentPage < totalPages) {
		currentPage += 1;
		updateVisible();
		scrollToTop();
	}
});
document.getElementById('pageEnd').addEventListener('click', () => {
	if (currentPage < totalPages) {
		currentPage = totalPages;
		updateVisible();
		scrollToTop();
	}
});

// ------------------ URL Filters ------------------

const updateURLFilters = () => {
	const params = new URLSearchParams();

	if (includeTags.length) params.set('include', includeTags.join('~'));
	if (excludeTags.length) params.set('exclude', excludeTags.join('~'));
	if (customList.length) params.set('custom', customList.join('~'));
	if (currentSort !== defaultSort) params.set('sort', currentSort);

	if (params.size) {
		const newURL =`${window.location.pathname}?${params.toString()}`;
		history.replaceState(null, '', newURL);
	} else {
		history.replaceState(null, '', window.location.pathname);
	}
};

const loadURLFilters = () => {
	const params = new URLSearchParams(window.location.search);
	const include = params.get('include');
	const exclude = params.get('exclude');
	const custom = params.get('custom');
	const sort = params.get('sort');

	if (include) {
		includeTags = include.split('~');
		includeTags.forEach(tag => {
			const button = document.querySelector(`.mangaTagButton[data-tag="${tag}"]`);
			if (button) button.classList.add('included');
		});
	}
	if (exclude) {
		excludeTags = exclude.split('~');
		excludeTags.forEach(tag => {
			const button = document.querySelector(`.mangaTagButton[data-tag="${tag}"]`);
			if (button) button.classList.add('excluded');
		});
	}
	if (custom) {
		customList = custom.split('~');
		customList.forEach(name => {
			const button = document.querySelector(`.mangaHeaderButton[data-name="${name}"]`);
			if (button) button.classList.add('selected');
		});
	}
	if (sort) {
		currentSort = sort;
		mangaSortButtons.forEach(btn => btn.classList.remove('selected'));
		const button = document.querySelector(`.mangaSortButton[data-sort="${sort}"]`);
		if (button) button.classList.add('selected');
	}

	filter();
};

document.addEventListener('DOMContentLoaded', () => {
	// Temporarily remove hash to prevent default jump
	const hash = window.location.hash;
	if (hash) {
		history.replaceState(null, '', window.location.pathname + window.location.search);
	}

	loadURLFilters();

	// Restore the hash and scroll manually
	if (hash) {
		setTimeout(() => {
			history.replaceState(null, '', window.location.pathname + window.location.search + hash);
			jumpToAnchor();
		}, 100);
	}
});
