class MangaEntry extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let link = this.getAttribute('link');
        let name = this.getAttribute('name');
        let image = this.getAttribute('image');
        let content = this.getAttribute('content').replace(/\n/g, '<br>').replace(/\*(.*)\*/g, '<i>$1</i>').replace(/\*\*(.*)\*\*/g, '<b>$1</b>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="link">$1</a>');
		let tags = this.getAttribute('tags');
		let rating = this.getAttribute('rating');
		addClass(this, tags);
		let id = name.replaceAll(' ', '');

        this.innerHTML = `
			<div class="mangaheader" id=${id}>
				<a href=${link} target="_blank" class="headerlink">${name}</a>
				<a href=#${id} class="headerlink headeranchor">🔗</a>
			</div>
			<hr/>
			<div class="mangawrapper">
				<img src=${image} onclick="window.open(\'${link}\', \'_blank\')" draggable="false" class="mangaimage">
				<div class="mangacontent">
					<div class="mangatagnames"></div>
					<pre class="mangareview">${content}</pre>
				</div>
			</div>	
        `;

		var tagnames = tags.split(' ');
		for (var i = 0; i < tagnames.length; i++) {
			const tag = document.createElement('a');
			tag.className = 'mangatagname'
			tag.innerText = tagnames[i];
			this.querySelector('.mangatagnames').appendChild(tag);
		}
		const rate = document.createElement('a');
		rate.className = 'mangatagname'
		rate.innerText = 'Rating: ' + rating + '/10';
		this.querySelector('.mangatagnames').appendChild(rate);
    }
}

customElements.define('manga-component', MangaEntry);

const tagfilter = [];

visibility('show');
function visibility(action) {
	var entries, i;
	entries = document.getElementsByClassName('manga');
	if (action === 'show') {
		for (i = 0; i < entries.length; i++) {
			addClass(entries[i], 'mangashow');
		}
	} else if (action === 'hide') {
		for (i = 0; i < entries.length; i++) {
			removeClass(entries[i], 'mangashow');
		}
	}
}

function addClass(element, name) {
	var i, arr1, arr2;
	arr1 = element.className.split(' ');
	arr2 = name.split(' ');
	for (i = 0; i < arr2.length; i++) {
		if (arr1.indexOf(arr2[i]) == -1) {
			element.className += ' ' + arr2[i];
		}
	}
}

function removeClass(element, name) {
	var i, arr1, arr2;
	arr1 = element.className.split(' ');
	arr2 = name.split(' ');
	for (i = 0; i < arr2.length; i++) {
		while (arr1.indexOf(arr2[i]) > -1) {
			arr1.splice(arr1.indexOf(arr2[i]), 1);
		}
	}
	element.className = arr1.join(' ');
}

function filter(tagfilter) {
	if (tagfilter.length === 0) {
		visibility('show');
		return;
	}
	var i, j, entries, current, goal;
	entries = document.getElementsByClassName('manga');
	current = 0;
	goal = tagfilter.length;
	for (i = 0; i < entries.length; i++) {
		for (j = 0; j < tagfilter.length; j++) {
			if (entries[i].className.includes(tagfilter[j])) {
				current += 1;
			}
			if (current === goal) {
				addClass(entries[i], 'mangashow');
			}
		}
		current = 0;
	}
}

var buttons = document.getElementById('mangatags').getElementsByClassName('mangabutton');
for (var i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', function() {
		if (!this.className.includes('active')) {
			this.className += ' active';
			tagfilter.push(this.getAttribute('tag'));
			visibility('hide');
			filter(tagfilter);
		} else {
			this.className = this.className.replace(' active', '');
			tagfilter.splice(tagfilter.indexOf(this.getAttribute('tag')), 1);
			visibility('hide');
			filter(tagfilter);
		}
	});
}

var entries = [].slice.call(document.getElementsByClassName('manga'));
entries.sort(function(a,b) {
	return a.getAttribute('name').toLowerCase().localeCompare(b.getAttribute('name').toLowerCase());
});
for (var i = 0; i < entries.length; i++) {
	document.getElementsByClassName('mangabox')[0].appendChild(entries[i]);
}
