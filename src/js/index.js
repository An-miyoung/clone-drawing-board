class DrawingBoard {
  MODE = "NONE";
  IsMouseDown = false;
  eraserColor = "#FFFFFF";
  backgroundColor = "#FFFFFF";
  isNavigatorVisible = false;
  undoArray = [];
  containerEl;
  canvasEl;
  toolbarEl;
  brushEl;
  colorPickerEl;
  brushPanelEl;
  brushSliderEl;
  brushSizePreviewEl;
  eraserEl;
  navigaterEl;
  navigatorImageContainerEl;
  navigatorImageEl;
  unDoEl;
  clearEl;
  downloadLinkEl;

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
    this.unDoEl = this.toolbarEl.querySelector("#undo");
    this.clearEl = this.toolbarEl.querySelector("#clear");
    this.downloadLinkEl = this.toolbarEl.querySelector("#download");
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
    this.unDoEl.addEventListener("click", this.onClickUnDo.bind(this));
    this.clearEl.addEventListener("click", this.onClickClear.bind(this));
    this.downloadLinkEl.addEventListener(
      "click",
      this.onClickDownload.bind(this)
    );
  }

  onClickDownload(e) {
    e.currentTarget.classList.toggle("active");
    // download ??? a tag ??? ???????????? href ??? ????????? ???????????? ????????? ??? ?????? ??????.
    // ????????? ???????????? jpg ????????? ???????????? ???????????? 1??? ??????
    this.downloadLinkEl.href = this.canvasEl.toDataURL("image/jpg", 1);
    // ????????? ???????????? ???????????? ????????? ??????.
    this.downloadLinkEl.download = "my_drawing.jpg";
  }

  onClickClear(e) {
    e.currentTarget.classList.toggle("active");
    this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.undoArray = [];
    this.updateNavigator();
    this.initCanvasBackground();
  }

  onClickUnDo(e) {
    if (this.undoArray.length === 0) {
      alert("???????????? ??? ??? ????????????.");
      return;
    }
    e.currentTarget.classList.toggle("active");
    let previousDataUrl = this.undoArray.pop();
    let previousImage = new Image();
    previousImage.onload = () => {
      this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.context.drawImage(
        previousImage,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height
      );
    };
    previousImage.src = previousDataUrl;
  }

  saveState() {
    if (this.undoArray.length > 4) {
      // ?????? ?????? ?????? ?????? URL ??? ?????????.
      this.undoArray.shift();
      this.undoArray.push(this.canvasEl.toDataURL());
    } else {
      this.undoArray.push(this.canvasEl.toDataURL());
    }
  }

  updateNavigator() {
    if (!this.isNavigatorVisible) return;
    this.navigatorImageEl.src = this.canvasEl.toDataURL();
  }

  onClickNavigator(e) {
    // isNavigatorVisible ??? toggle ????????? ?????? ?????????
    this.isNavigatorVisible = !e.currentTarget.classList.contains("active");
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
    //TODO: ???????????? ????????? ???????????? ????????? ????????? ????????? ????????? ?????? ??????
  }

  onChangeColor(e) {
    this.brushSizePreviewEl.style.background = e.target.value;
  }

  onChangeBrushSize(e) {
    this.brushSizePreviewEl.style.width = `${e.target.value}px`;
    this.brushSizePreviewEl.style.height = `${e.target.value}px`;
  }

  onClickBrush(e) {
    // brush tag ?????? ??????????????? ????????? (brush ?????? i tag ??? ????????? ???????????? ?????????)
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

    this.saveState();
  }

  getMousePosition(e) {
    // (0,0) ???????????? ???????????? clientX,Y ?????? canvas ???????????? ????????? ?????? ?????????
    const boundaries = this.canvasEl.getBoundingClientRect();
    return {
      x: e.clientX - boundaries.left,
      y: e.clientY - boundaries.top,
    };
  }
}

new DrawingBoard();
