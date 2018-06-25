module.exports = (class controller extends require('./../common/base-class-parent') {
    const _maxWhileIterations = 100;

    static $inject = [
        '$window'
    ];

    constructor($window) {
        super({$window});
    }

    init($scope, el) {
        Object.assign(this.$s, {
            el,
            $unitSize: () => $scope.$eval(el.attr('unit-size')),
            $gap: () => $scope.$eval(el.attr('gap')),
            $singleRow: () => $scope.$eval(el.attr('single-row')),
            $paddingRight: () => $scope.$eval(el.attr('padding-right')) || 0
        });

        const resizeHandler = this.refresh.bind(this);
        angular.element(this.$i.$window).on('resize', resizeHandler);

        $scope.$on('destroy', () => {
            delete this.$s;
            angular.element(this.$i.$window).off('resize', resizeHandler);
        });

        this.$s.el.css('visibility', 'hidden');

        this.$s.initDefer.resolve();
    }

    refresh(runImmediately) {
        if (runImmediately) {
            return this._initMatrix();
        }
        if (this.$s.initMatrixTimeout) {
            clearTimeout(this.$s.initMatrixTimeout);
        }
        this.$s.initMatrixTimeout = setTimeout(this._initMatrix.bind(this), 50);
    }

    _initMatrix({noComparison} = {}) {
        if (noComparison) {
            this.$s._initMatrix__iteration++;
        } else {
            this.$s._initMatrix__iteration = 1;
        }

        const state = this.$s;
        const singleRow = state.$singleRow();
        const containerWidth = singleRow ? Number.MAX_VALUE : state.el.width();
        const unitSize = state.$unitSize();
        const _tiles = _(state.children);
        const cellsCount = _tiles.reduce((sum, tile) => sum + tile.$s.$size(), 0);
        let rowSize = singleRow ? cellsCount : Math.trunc(containerWidth / unitSize.width);

        rowSize = singleRow ? cellsCount : Math.trunc(containerWidth / unitSize.width);

        // TODO this implementation assumes that "gap" is less than "tileWidth"
        const widthWithGaps = rowSize * unitSize.width + ((rowSize - 1) * state.$gap());
        if (widthWithGaps > containerWidth) {
            rowSize--;
        }
        rowSize = Math.max(rowSize, 1);

        // keep common calculated values
        state.rowSize = rowSize;
        state.cellsCount = cellsCount;
        state.matrix = _.times(state.cellsCount, () => Array.apply(null, Array(rowSize)).map(_.constant(0)));

        const tilesRows = _tiles
            .groupBy(tile => tile.$s.$row())
            .values()
            .value();

        for (let rowIndex = 0; rowIndex < tilesRows.length; rowIndex++) {
            this._fitTilesRowToMatrix(tilesRows, rowIndex);
        }

        if (!noComparison) {
            this._renderMatrix();

            let matrix1 = state.matrix;
            let matrix2;

            let iterationsLeft = this._maxWhileIterations;
            while ((!matrix2 || !this._matrixEqual(matrix1, matrix2)) && iterationsLeft--) {
                matrix1 = matrix2 || matrix1;
                this._initMatrix({noComparison: true});
                this._renderMatrix();
                matrix2 = state.matrix;
            }
            if (iterationsLeft <= 0) {
                throw 'Max iterations limit is reached';
            }
        }
    }

    _matrixEqual(array1, array2) {
        if (array1.length !== array2.length) {
            return;
        }

        for (let i = 0, len = array1.length; i < len; i++) {
            if (_.isArray(array1[i]) ? !this._matrixEqual(array1[i], array2[i]) : array1[i] !== array2[i]) {
                return;
            }
        }

        return true;
    }

    _fitTilesRowToMatrix(tilesRows, rowIndex) {
        const tilesRow = tilesRows[rowIndex];
        let indexes;
        let tile;

        if (!tilesRow.length) {
            return;
        }

        let fittableTilesColumnIndex = 0;
        const fittableTiles = tilesRow.filter(tile => {
            const columnsAvailable = this._canFitIntoRowWithMaxColumnSize(tile, rowIndex, fittableTilesColumnIndex);
            if (columnsAvailable) {
                fittableTilesColumnIndex += columnsAvailable;
            }
            return !!columnsAvailable;
        });

        // all tiles can be fitted into the row with "maxColumns" size
        if (fittableTiles.length === tilesRow.length) {
            this._fitRow(tilesRows, rowIndex);
            return;
        }

        // fit an entire tile
        //if (fittableTiles.length) {
        //    indexes = this._calculateAvailableIndexes(rowIndex);
        //    if (indexes.columnsAvailableRaw > 1) {
        //        tile = _.find(tilesRow, tile => tile.$s.$maxColumns() === indexes.columnsAvailableRaw);
        //        if (tile) {
        //            this._fitIntoRow({tile, indexes});
        //            _.remove(tilesRow, tile);
        //        }
        //    }
        //}

        // tiles shortening and fitting
        let iterationsLeft = this._maxWhileIterations;
        while (tilesRow.length && (indexes = this._calculateAvailableIndexes(rowIndex)).columnsAvailable && iterationsLeft--) {
            // - currently a simpler "preserving tiles position" strategy is implemented, tiles sizes change applies if needed
            // - another strategy would be "preserving tiles sizes as much as possible"
            // ie taking tiles from the available pull with exact size match and only if there is no such tile do size resizing
            tile = _.head(tilesRow);
            this._fitIntoRow({tile, indexes});
            _.remove(tilesRow, tile);
        }
        if (iterationsLeft <= 0) {
            throw 'Fitting tiles into the row has failed, max iterations limit is reached.';
        }

        // put remaining tiles to the next row
        if (tilesRow.length) {
            if (!tilesRows[rowIndex + 1]) {
                tilesRows.push([]);
            }
            tilesRows[rowIndex + 1].unshift(...tilesRow);
            tilesRow.length = 0;
        }
    }

    _canFitIntoRowWithMaxColumnSize(tile, rowIndex, columnIndex) {
        const indexes = this._calculateAvailableIndexes(rowIndex, columnIndex);
        const maxColumns = tile.$s.$maxColumns();
        return indexes.columnsAvailable >= maxColumns ? maxColumns : 0;
    }

    _fitRow(tilesRows, rowIndex) {
        const tilesRow = tilesRows[rowIndex];
        let iterationsLeft = this._maxWhileIterations;

        while (tilesRow.length && iterationsLeft--) {
            const tile = tilesRow.shift();
            this._fitIntoRow({tile, rowIndex});
        }
        if (iterationsLeft <= 0) {
            throw 'Fitting tiles into the row has failed, max iterations limit is reached.';
        }
    }

    _fitIntoRow({tile, rowIndex, indexes}) {
        const matrix = this.$s.matrix;
        const availableIndexes = indexes || this._calculateAvailableIndexes(rowIndex);

        let columnsCount = Math.min(availableIndexes.columnsAvailable, tile.$s.$maxColumns());
        // Math.max is needed to handle possible unit[size-column-*] case
        const rowsCount = Math.max(Math.trunc(tile.$s.$size() / columnsCount), 1);

        availableIndexes.columnEnd = availableIndexes.columnStart + columnsCount;
        availableIndexes.rowEnd = availableIndexes.rowStart + rowsCount;

        for (let columnIdx = availableIndexes.columnStart; columnIdx < availableIndexes.columnEnd; columnIdx++) {
            for (let rowIdx = availableIndexes.rowStart; rowIdx < availableIndexes.rowEnd; rowIdx++) {
                matrix[rowIdx][columnIdx] = tile;
            }
        }
    }

    _calculateAvailableIndexes(rowIndex, columnIndexStart) {
        const matrix = this.$s.matrix;
        const rowSize = this.$s.rowSize;
        const indexes = {
            columnsAvailable: 0,
            rowStart: rowIndex
        };

        // calculate tile column start index
        for (let columnIndex = columnIndexStart || 0; columnIndex < rowSize; columnIndex++) {
            const cellAvailable = !matrix[indexes.rowStart][columnIndex];
            if (cellAvailable) {
                if (_.isUndefined(indexes.columnStart)) {
                    indexes.columnStart = columnIndex;
                }
                indexes.columnsAvailable++;
            } else if (!_.isUndefined(indexes.columnStart)) {
                break;
            }
        }

        //indexes.columnsAvailableRaw = indexes.columnsAvailable;
        if (indexes.columnsAvailable > 1 && indexes.columnsAvailable % 2) {
            indexes.columnsAvailable--;
        }

        return indexes;
    }

    _renderMatrix() {
        const state = this.$s;
        const handledTiles = [];
        const unitSize = state.$unitSize();

        for (let rowIndex = 0; rowIndex < state.matrix.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < state.matrix[rowIndex].length; columnIndex++) {
                const tile = state.matrix[rowIndex][columnIndex];

                // TODO replace "_.includes" by the more efficient solution (map/hashset)
                if (!tile || _.includes(handledTiles, tile)) {
                    continue;
                }

                const dimensions = this._calculateDimensions(state.matrix, rowIndex, columnIndex, tile);
                this._renderElement(tile.$s, columnIndex, rowIndex, dimensions);

                //setTimeout(() => this._renderTile(tile), 0);
                this._renderTileUnits(tile);

                handledTiles.push(tile);
            }
        }

        if (handledTiles.length) {
            const lastTileState = _.last(handledTiles).$s;
            const containerWidth = state.rowSize * unitSize.width + ((state.rowSize - 1) * state.$gap());
            const containerHeight = lastTileState.position.top + lastTileState.size.height;
            state.el
                .find('> items')
                .width(containerWidth + state.$paddingRight())
                .height(containerHeight);
        }

        this.$s.el.css('visibility', 'visible');
    }

    // TODO simplify this method by putting units into 2d matrix the same as tiles and then use general "_calculateDimensions" method
    _renderTileUnits(tile) {
        const tileDimensions = tile.$s.dimensions;
        const unitDimensions = {x: 0, y: 0};
        let unitState;
        let currentUnitIndex = 0;
        let startRowIndex = 0;
        let startColumnIndex = 0;

        for (let rowIndex = 0; rowIndex < tileDimensions.y; rowIndex++) {
            unitDimensions.y++;
            for (let columnIndex = 0; columnIndex < tileDimensions.x; columnIndex++) {
                unitDimensions.x++;
                unitState = tile.$s.children[currentUnitIndex].$s;

                if (unitState.$size() === (unitDimensions.x * unitDimensions.y)) {
                    currentUnitIndex++;

                    // isNoMoreUnits is needed to handle possible unit[size-column-*] case
                    const isNoMoreUnits = currentUnitIndex >= tile.$s.children.length;
                    if (isNoMoreUnits && currentUnitIndex === 1 /*tileDimensions.x - unitDimensions.x > 0*/) {
                        unitDimensions.x = tileDimensions.x;
                    }

                    this._renderElement(unitState, startColumnIndex, startRowIndex, unitDimensions);

                    if (isNoMoreUnits) {
                        return;
                    }

                    const isLastCellInRow = columnIndex === (tileDimensions.x - 1);
                    startRowIndex = isLastCellInRow ? rowIndex + 1 : rowIndex;
                    startColumnIndex = isLastCellInRow ? 0 : columnIndex + 1;
                    unitDimensions.x = 0;
                    unitDimensions.y = isLastCellInRow ? 0 : 1;
                }
            }
            unitDimensions.x = 0;
        }
    }

    _renderElement(elementState, columnIndex, rowIndex, dimensions) {
        const state = this.$s;
        const statUnitSize = state.$unitSize();
        const stateGap = state.$gap();

        const left = columnIndex * statUnitSize.width + columnIndex * stateGap;
        const top = rowIndex * statUnitSize.height + rowIndex * stateGap;
        const x = dimensions.x;
        const y = dimensions.y;
        const width = x * statUnitSize.width + (x - 1) * stateGap;
        const height = y * statUnitSize.height + (y - 1) * stateGap;

        elementState.el
            .css({
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
                width: `${width}px`,
                height: `${height}px`
            })
            .attr('x', x)
            .attr('y', y);

        Object.assign(elementState, {
            dimensions: Object.assign({}, dimensions),
            size: {width, height},
            position: {left, top}
        });
    }

    _calculateDimensions(array2DToScan, rowIndex, columnIndex, itemToCheck) {
        const dimensions = {};
        let index;

        index = columnIndex;
        while (array2DToScan[rowIndex][index] === itemToCheck) index++;
        dimensions.x = index - columnIndex;

        index = rowIndex;
        while (index < array2DToScan.length && array2DToScan[index][columnIndex] === itemToCheck) index++;
        dimensions.y = index - rowIndex;

        return dimensions;
    }

    linkChild($ctrlChild) {
        super.linkChild($ctrlChild);
        this.refresh();
    }

    unlinkChild($ctrlChild) {
        super.unlinkChild($ctrlChild);
        this.refresh();
    }
});
