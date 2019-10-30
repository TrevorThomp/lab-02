'use strict';

function Image(img) {
  this.image_url = img.image_url;
  this.title = img.title;
  this.description = img.description;
  this.keyword = img.keyword;
  this.horns = img.horns;
}

Image.allImages = [];

Image.prototype.render = function() {
  let imageClone = $('#photo-template').clone();
  let $imageClone = $(imageClone[0].content);

  $imageClone.find('h2').text(this.title);
  $imageClone.find('img').attr('src', this.image_url);
  $imageClone.find('p').text(this.hobbies);
  $imageClone.find('section').attr('class', this.keyword);
  $imageClone.attr('class', this.title);
  $imageClone.appendTo('main');

  $('#form').append(
    $('<option></option>')
      .attr('value', this.keyword)
      .text(this.keyword));

  // Loop attributed by https://stackoverflow.com/questions/23729456/how-to-remove-duplicate-dropdown-option-elements-with-same-value
  let usedNames = {};
  $('#form > option').each(function () {
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
  $('h2').hide();
  $('img').hide();
  $(`section[class='${$selectedImage}'] img, section[class='${$selectedImage}'] h2`).show();
});

$(() => Image.getJson());
