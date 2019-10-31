'use strict';

// Image constructor function
function Image(img) {
  this.image_url = img.image_url;
  this.title = img.title;
  this.description = img.description;
  this.keyword = img.keyword;
  this.horns = img.horns;
  // If apostrophes exists, remove
  this.removeApostrophe = this.title.replace(/'/g, '');
  // If whitespace exists, remove
  this.removeSpace = this.removeApostrophe.replace(/ /g, '');
}

Image.allImages = [];

// Image render function
Image.prototype.render = function() {
  let imageClone = $('#photo-template').clone();
  let $imageClone = $(imageClone[0].content);

  $imageClone.find('h2').text(this.title);
  $imageClone.find('img').attr({'src': this.image_url, 'class': 'lightbox'});
  $imageClone.find('p').text(`Number of Horns: ${this.horns}`);
  $imageClone.find('section').addClass(`${this.keyword} ${this.horns} ${this.removeSpace}`)
  $imageClone.attr('class', this.title);
  $imageClone.appendTo('main');

  // Append keywords to specific optgroup
  $('#keyword-option').append(
    $('<option></option>')
      .attr('value', this.keyword)
      .text(this.keyword));

  // Append titles to specific optgroup
  $('#title-option').append(
    $('<option></option>')
      .attr('value', this.removeSpace)
      .text(this.title));

  // Append horns to specific optgroup
  $('#horn-option').append(
    $('<option></option>')
      .attr('value', this.horns)
      .text(this.horns));

  // Loop attributed by https://stackoverflow.com/questions/23729456/how-to-remove-duplicate-dropdown-option-elements-with-same-value
  // Removes duplicate keywords in the select menu
  let usedNames = {};
  $('#form option').each(function () {
    if(usedNames[this.text]) {
      $(this).remove();
    } else {
      usedNames[this.text] = this.value;
    }
  });
};

// Retrieve JSON data and push into array
Image.getJson = () => {
  $.get('../data/page-2.json')
    .then(data => {
      data.forEach(item => {
        Image.allImages.push(new Image(item))
      });
    })
    .then(Image.loadImages);
};

// Loops through array of images and renders each one
Image.loadImages = () => {
  Image.allImages.forEach(image => image.render());
}

// Displays images based on user selected option
$(`select[name='images'`).on('change', function() {
  let $selectedImage = $(this).val();
  $('section').hide();
  $(`section.${$selectedImage}`).show();
});

// jQuery lightbox trigger
$('.lightbox').click(function() {
  $('#lightbox').addClass('open');
})

$('#close').click(function() {
  $('#lightbox').removeClass('open')
});

// Document ready function
$(() => Image.getJson());
