'use strict';

function Image(img) {
  this.image_url = img.image_url;
  this.title = img.title;
  this.description = img.description;
  this.keyword = img.keyword;
  this.horns = img.horns;
  this.removeApostrophe = this.title.replace(/'/g, '');
  this.removeSpace = this.removeApostrophe.replace(/ /g, '');
}

Image.allImages = [];


Image.prototype.render = function() {
  let imageClone = $('#photo-template').clone();
  let $imageClone = $(imageClone[0].content);

  $imageClone.find('h2').text(this.title);
  $imageClone.find('img').attr('src', this.image_url);
  $imageClone.find('p').text(`Number of Horns: ${this.horns}`);
  $imageClone.find('section').addClass(`${this.keyword} ${this.horns} ${this.removeSpace}`)
  $imageClone.attr('class', this.title);
  $imageClone.appendTo('main');


  $('#keyword-option').append(
    $('<option></option>')
      .attr('value', this.keyword)
      .text(this.keyword));

  $('#title-option').append(
    $('<option></option>')
      .attr('value', this.removeSpace)
      .text(this.title));

  $('#horn-option').append(
    $('<option></option>')
      .attr('value', this.horns)
      .text(this.horns));

  // Loop attributed by https://stackoverflow.com/questions/23729456/how-to-remove-duplicate-dropdown-option-elements-with-same-value
  let usedNames = {};
  $('#form option').each(function () {
    if(usedNames[this.text]) {
      $(this).remove();
    } else {
      usedNames[this.text] = this.value;
    }
  });
};

Image.getJson = () => {
  $.get('../data/page-1.json')
    .then(data => {
      data.forEach(item => {
        Image.allImages.push(new Image(item))
      });
    })
    .then(Image.loadImages);
};

Image.loadImages = () => {
  Image.allImages.forEach(image => image.render());
}

$(`select[name='images'`).on('change', function() {
  let $selectedImage = $(this).val();
  $('section').hide();
  $(`section.${$selectedImage}`).show();
});

$(() => Image.getJson());
