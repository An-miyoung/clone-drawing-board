class DrawingBoard {
  MODE = "NONE";
  IsMouseDown = false;
  eraserColor = "#FFFFFF";
  backgroundColor = "#FFFFFF";

  constructor() {
    this.assignElement();
    this.initContext();
    this.initCanvasBackground();
    this.addEvent();
  }

  assignElement() {
    this.containerEl = document.getElementById("container");
    this.canvasEl = this.containerEl.querySelector("#canvas");
    this.toolbarEl = this.containerEl.querySelector("#toolbar");
    this.brushEl = this.containerEl.querySelector("#brush");
    this.colorPickerEl = this.toolbarEl.querySelector("#colorPicker");
    this.brushPanelEl = this.containerEl.querySelector("#brushPanel");
    this.brushSliderEl = this.brushPanelEl.querySelector("#brushSize");
    this.brushSizePreviewEl =
      this.brushPanelEl.querySelector("#brushSizePreview");
    this.eraserEl = this.toolbarEl.querySelector("#eraser");
    this.navigaterEl = this.toolbarEl.querySelector("#navigator");
    this.navigatorImageContainerEl = this.containerEl.querySelector("#imgNav");
    this.navigatorImageEl =
      this.navigatorImageContainerEl.querySelector("#canvasImg");
  }
  initContext() {
    this.context = this.canvasEl.getContext("2d");
  }
  initCanvasBackground() {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);
  }
  addEvent() {
    this.brushEl.addEventListener("click", this.onClickBrush.bind(this));
    this.canvasEl.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvasEl.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvasEl.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.canvasEl.addEventListener("mouseout", this.onMouseOut.bind(this));
    this.brushSliderEl.addEventListener(
      "input",
      this.onChangeBrushSize.bind(this)
    );
    this.colorPickerEl.addEventListener("input", this.onChangeColor.bind(this));
    this.eraserEl.addEventListener("click", this.onClickEraser.bind(this));
    this.navigaterEl.addEventListener(
      "click",
      this.onClickNavigator.bind(this)
    );
  }

  updateNavigator() {
    this.navigatorImageEl.src = this.canvasEl.toDataURL();
  }

  onClickNavigator(e) {
    e.currentTarget.classList.toggle("active");
    this.navigatorImageContainerEl.classList.toggle("hide");
    this.updateNavigator();
  }

  onClickEraser(e) {
    const isActive = e.currentTarget.classList.contains("active");
    this.MODE = isActive ? "NONE" : "ERASER";
    this.canvasEl.style.cursor = isActive ? "default" : "crosshair";
    this.brushEl.classList.remove("active");
    this.brushPanelEl.classList.add("hide");
    e.currentTarget.classList.toggle("active");
    //TODO: 지우개를 누르면 지우개의 굵기를 지정할 패널이 열리게 하기 위해
  }

  onChangeColor(e) {
    this.brushSizePreviewEl.style.background = e.target.value;
  }

  onChangeBrushSize(e) {
    this.brushSizePreviewEl.style.width = `${e.target.value}px`;
    this.brushSizePreviewEl.style.height = `${e.target.value}px`;
  }

  onClickBrush(e) {
    // brush tag 에만 적용시키기 위해서 (brush 아래 i tag 가 눌리면 작동하지 않도록)
    const isActive = e.currentTarget.classList.contains("active");
    this.MODE = isActive ? "NONE" : "BRUSH";
    this.canvasEl.style.cursor = isActive ? "default" : "crosshair";
    e.currentTarget.classList.toggle("active");
    this.brushPanelEl.classList.toggle("hide");
    this.eraserEl.classList.remove("active");
  }

  onMouseOut() {
    if (this.Mode === "NONE") return;
    this.IsMouseDown = false;
    this.updateNavigator();
  }

  onMouseMove(e) {
    if (this.IsMouseDown === false) return;
    const currentPosition = this.getMousePosition(e);
    this.context.lineTo(currentPosition.x, currentPosition.y);
    this.context.stroke();
  }

  onMouseUp() {
    if (this.MODE === "NONE") return;
    this.IsMouseDown = false;
    this.updateNavigator();
  }

  onMouseDown(e) {
    if (this.MODE === "NONE") return;
    this.IsMouseDown = true;
    const currentPosition = this.getMousePosition(e);
    this.context.beginPath();
    this.context.moveTo(currentPosition.x, currentPosition.y);
    this.context.lineCap = "round";

    this.context.strokeStyle =
      this.MODE === "BRUSH" ? this.colorPickerEl.value : this.eraserColor;
    this.context.lineWidth = this.brushSliderEl.value;
  }

  getMousePosition(e) {
    // (0,0) 기준으로 계산되는 clientX,Y 값을 canvas 기준으로 만들어 주기 위해서
    const boundaries = this.canvasEl.getBoundingClientRect();
    return {
      x: e.clientX - boundaries.left,
      y: e.clientY - boundaries.top,
    };
  }
}

new DrawingBoard();
