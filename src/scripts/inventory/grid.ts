import InventoryConfig from "./inventoryConfig";

export default class Grid extends Phaser.GameObjects.Container {

  public readonly gridWidth: number;
  public readonly gridHeight: number;
  private cells: Phaser.GameObjects.Sprite[][];
  private currentCell: Phaser.GameObjects.Sprite | null;

  public readonly cellSize: number;
  public mouseX: number;
  public mouseY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, gridWidth: number, gridHeight: number, cellSize: number) {
    super(scene, x, y);
    this.cellSize = cellSize;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    this.mouseX = 0;
    this.mouseY = 0;

    this.cells = [];

    this.createGrid();
    scene.add.existing(this);

    scene.input.on('pointermove', this.handleMouseMove, this);
  }

  private createGrid(): void {
    for (let row = 0; row < this.gridHeight; row++) {
      this.cells[row] = [];
      for (let col = 0; col < this.gridWidth; col++) {
        const cell = this.scene.add.sprite(col * this.cellSize, row * this.cellSize, 'inventory_slot');
        cell.setOrigin(0);
        this.add(cell);
        this.cells[row][col] = cell;
      }
    }
  }

  private handleMouseMove(pointer: Phaser.Input.Pointer): void {
    this.mouseX = pointer.x;
    this.mouseY = pointer.y;
    this.detectCellUnderMouse();
  }

  public detectCellUnderMouse(): [number, number] {
    const adjustedX = this.mouseX - this.x;
    const adjustedY = this.mouseY - this.y;
    const col = Math.floor(adjustedX / this.cellSize);
    const row = Math.floor(adjustedY / this.cellSize);

    if (row >= 0 && row < this.gridHeight && col >= 0 && col < this.gridWidth) {
      const cell = this.cells[row][col];

      if (this.currentCell !== cell) {

        if (this.currentCell)
          this.currentCell.clearTint();

        cell.tint = InventoryConfig.MOUSE_HOVER_COLOR;
        this.currentCell = cell;
      }

      return [col, row];
    } else {
      if (this.currentCell) {
        this.currentCell.clearTint();
        this.currentCell = null;
        return [-1, -1];
      }
    }
    return [-1, -1];
  }
}
