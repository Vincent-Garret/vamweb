//tYPING
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = "";
        this.wordIndex = 0;
        this.wait = parseInt(wait, 7);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if (this.isDeleting) {
            // Remove characters
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add charaters
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        // Initial Type Speed
        let typeSpeed = 200;

        if (this.isDeleting) {
            // Increase speed by half when deleting
            typeSpeed /= 3;
        }

        // If word is complete
        if (!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === "") {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 1000;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Init On DOM Load
document.addEventListener("DOMContentLoaded", init);

// Init App
function init() {
    const txtElement = document.querySelector(".txt-type");
    const words = JSON.parse(txtElement.getAttribute("data-words"));
    const wait = txtElement.getAttribute("data-wait");
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);
}


let  main = document.getElementById("main");
function findPos(elem) {
    let box = elem.getBoundingClientRect(),
        offset   = box.top;

    alert('Element is ' + offset + ' vertical pixels from <body>');
    console.log(offset);
    return offset - 70;
}

mainPos = findPos(main);

window.onscroll = function colorChange(){
    const link = document.getElementsByClassName('change');
    const nav = document.getElementsByClassName('nav');
    let logo = document.getElementById('logo');

    for (i = 0; i < 3; i++){
        if (document.documentElement.scrollTop >= (mainPos)){
            link[i].classList.add('changeColor');
            logo.src = "img/logoBlack.png";
        }
        if (document.documentElement.scrollTop < mainPos){
            link[i].classList.remove('changeColor');
            logo.src = 'img/logoWhite.png';
        }
    }
    let scrollFromTop = document.documentElement.scrollTop;

    console.log(scrollFromTop)
};

console.log(mainPos);
