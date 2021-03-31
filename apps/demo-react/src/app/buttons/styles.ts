var style = document.createElement('style');
style.innerHTML = `
  #playButton {
  background-color: blueviolet;
  }
  .rs-controls{
  min-width: 30px;
  height: 30px;
  cursor: pointer;
  margin:1px;
}
  `;
document.head.appendChild(style);
export default style
