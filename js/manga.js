class MangaEntry extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let link = this.getAttribute('link');
        let name = this.getAttribute('name');
        let image = this.getAttribute('image');
        let content = this.getAttribute('content');
		let tags = this.getAttribute('tags');
		addClass(this, tags);

        this.innerHTML = `
			<a href=${link} target="_blank" class="headerlink listheader">${name}  🔗</a>
			<hr/>
			<div class="mangawrapper">
				<img src=${image} onclick="window.open(this.src)" draggable="false" class="mangaimage">
				<div class="imagecontent">
					<div class="mangatagnames"></div>
					<pre class="mangareview">${content}</pre>
				</div>
			</div>	
			<br/>
        `;

		var tagnames = tags.split(' ');
		for (var i = 0; i < tagnames.length; i++) {
			const tag = document.createElement('a');
			tag.className = 'mangatagname'
			tag.innerText = tagnames[i];
			console.log(this);
			this.querySelector('.mangatagnames').appendChild(tag);
		}
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
