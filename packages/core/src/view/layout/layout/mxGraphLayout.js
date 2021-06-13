/**
 * Copyright (c) 2006-2018, JGraph Ltd
 * Copyright (c) 2006-2018, Gaudenz Alder
 * Updated to ES9 syntax by David Morrissey 2021
 * Type definitions from the typed-mxgraph project
 */

import Dictionary from '../../../util/Dictionary';
import Rectangle from '../../geometry/Rectangle';
import Geometry from '../../geometry/Geometry';
import Point from '../../geometry/Point';

/**
 * @class mxGraphLayout
 *
 * Base class for all layout algorithms in mxGraph. Main public functions are
 * {@link moveCell} for handling a moved cell within a layouted parent, and {@link execute} for
 * running the layout on a given parent cell.
 *
 * Known Subclasses:
 *
 * {@link mxCircleLayout}, {@link mxCompactTreeLayout}, {@link mxCompositeLayout},
 * {@link mxFastOrganicLayout}, {@link mxParallelEdgeLayout}, {@link mxPartitionLayout},
 * {@link mxStackLayout}
 */
class mxGraphLayout {
  constructor(graph) {
    this.graph = graph;
  }

  /**
   * Reference to the enclosing {@link mxGraph}.
   */
  // graph: mxGraph;
  graph = null;

  /**
   * Boolean indicating if the bounding box of the label should be used if
   * its available. Default is true.
   */
  // useBoundingBox: boolean;
  useBoundingBox = true;

  /**
   * The parent cell of the layout, if any
   */
  // parent: mxCell;
  parent = null;

  /**
   * Notified when a cell is being moved in a parent that has automatic
   * layout to update the cell state (eg. index) so that the outcome of the
   * layout will position the vertex as close to the point (x, y) as
   * possible.
   *
   * Empty implementation.
   *
   * @param cell {@link mxCell} which has been moved.
   * @param x X-coordinate of the new cell location.
   * @param y Y-coordinate of the new cell location.
   */
  // moveCell(cell: mxCell, x: number, y: number): void;
  moveCell(cell, x, y) {}

  /**
   * Function: resizeCell
   *
   * Notified when a cell is being resized in a parent that has automatic
   * layout to update the other cells in the layout.
   *
   * Empty implementation.
   *
   * Parameters:
   *
   * cell - <mxCell> which has been moved.
   * bounds - <mxRectangle> that represents the new cell bounds.
   */
  resizeCell(cell, bounds) {}

  /**
   * Executes the layout algorithm for the children of the given parent.
   *
   * @param parent {@link mxCell} whose children should be layed out.
   */
  // execute(parent: mxCell): void;
  execute(parent) {}

  /**
   * Returns the graph that this layout operates on.
   */
  // getGraph(): mxGraph;
  getGraph() {
    return this.graph;
  }

  /**
   * Returns the constraint for the given key and cell. The optional edge and
   * source arguments are used to return inbound and outgoing routing-
   * constraints for the given edge and vertex. This implementation always
   * returns the value for the given key in the style of the given cell.
   *
   * @param key Key of the constraint to be returned.
   * @param cell {@link mxCell} whose constraint should be returned.
   * @param edge Optional {@link mxCell} that represents the connection whose constraint
   * should be returned. Default is null.
   * @param source Optional boolean that specifies if the connection is incoming
   * or outgoing. Default is null.
   */
  // getConstraint(key: string, cell: mxCell, edge?: mxCell, source?: boolean): any;
  getConstraint(key, cell, edge, source) {
    return this.graph.getCurrentCellStyle(cell)[key];
  }

  /**
   * Traverses the (directed) graph invoking the given function for each
   * visited vertex and edge. The function is invoked with the current vertex
   * and the incoming edge as a parameter. This implementation makes sure
   * each vertex is only visited once. The function may return false if the
   * traversal should stop at the given vertex.
   *
   * Example:
   *
   * (code)
   * mxLog.show();
   * var cell = graph.getSelectionCell();
   * graph.traverse(cell, false, function(vertex, edge)
   * {
   *   mxLog.debug(graph.getLabel(vertex));
   * });
   * (end)
   *
   * @param vertex {@link mxCell} that represents the vertex where the traversal starts.
   * @param directed Optional boolean indicating if edges should only be traversed
   * from source to target. Default is true.
   * @param func Visitor function that takes the current vertex and the incoming
   * edge as arguments. The traversal stops if the function returns false.
   * @param edge Optional {@link mxCell} that represents the incoming edge. This is
   * null for the first step of the traversal.
   * @param visited Optional {@link Dictionary} of cell paths for the visited cells.
   */
  // traverse(vertex: mxCell, directed?: boolean, func?: Function, edge?: mxCell, visited?: mxDictionary): void;
  traverse(vertex, directed, func, edge, visited) {
    if (func != null && vertex != null) {
      directed = directed != null ? directed : true;
      visited = visited || new Dictionary();

      if (!visited.get(vertex)) {
        visited.put(vertex, true);
        const result = func(vertex, edge);

        if (result == null || result) {
          const edgeCount = vertex.getEdgeCount();

          if (edgeCount > 0) {
            for (let i = 0; i < edgeCount; i += 1) {
              const e = vertex.getEdgeAt(i);
              const isSource = e.getTerminal(true) === vertex;

              if (!directed || isSource) {
                const next = this.graph.view.getVisibleTerminal(e, !isSource);
                this.traverse(next, directed, func, e, visited);
              }
            }
          }
        }
      }
    }
  }

  /**
   * Returns true if the given parent is an ancestor of the given child.
   *
   * @param parent {@link mxCell} that specifies the parent.
   * @param child {@link mxCell} that specifies the child.
   * @param traverseAncestors boolean whether to
   */
  // isAncestor(parent: mxCell, child: mxCell, traverseAncestors?: boolean): boolean;
  isAncestor(parent, child, traverseAncestors) {
    if (!traverseAncestors) {
      return child.getParent() === parent;
    }

    if (child === parent) {
      return false;
    }

    while (child != null && child !== parent) {
      child = child.getParent();
    }

    return child === parent;
  }

  /**
   * Returns a boolean indicating if the given {@link mxCell} is movable or
   * bendable by the algorithm. This implementation returns true if the given
   * cell is movable in the graph.
   *
   * @param cell {@link mxCell} whose movable state should be returned.
   */
  // isVertexMovable(cell: mxCell): boolean;
  isVertexMovable(cell) {
    return this.graph.isCellMovable(cell);
  }

  /**
   * Returns a boolean indicating if the given {@link mxCell} should be ignored by
   * the algorithm. This implementation returns false for all vertices.
   *
   * @param vertex {@link mxCell} whose ignored state should be returned.
   */
  // isVertexIgnored(vertex: mxCell): boolean;
  isVertexIgnored(vertex) {
    return !vertex.isVertex() || !vertex.isVisible();
  }

  /**
   * Returns a boolean indicating if the given {@link mxCell} should be ignored by
   * the algorithm. This implementation returns false for all vertices.
   *
   * @param cell {@link mxCell} whose ignored state should be returned.
   */
  // isEdgeIgnored(edge: mxCell): boolean;
  isEdgeIgnored(edge) {
    const model = this.graph.getModel();

    return (
      !edge.isEdge() ||
      !edge.isVisible() ||
      edge.getTerminal(true) == null ||
      edge.getTerminal(false) == null
    );
  }

  /**
   * Disables or enables the edge style of the given edge.
   */
  // setEdgeStyleEnabled(edge: mxCell, value: any): void;
  setEdgeStyleEnabled(edge, value) {
    this.graph.setCellStyles('noEdgeStyle', value ? '0' : '1', [edge]);
  }

  /**
   * Disables or enables orthogonal end segments of the given edge.
   */
  // setOrthogonalEdge(edge: mxCell, value: any): void;
  setOrthogonalEdge(edge, value) {
    this.graph.setCellStyles('orthogonal', value ? '1' : '0', [edge]);
  }

  /**
   * Determines the offset of the given parent to the parent
   * of the layout
   */
  // getParentOffset(parent: mxCell): mxPoint;
  getParentOffset(parent) {
    const result = new Point();

    if (parent != null && parent !== this.parent) {
      const model = this.graph.getModel();

      if (model.isAncestor(this.parent, parent)) {
        let parentGeo = parent.getGeometry();

        while (parent !== this.parent) {
          result.x += parentGeo.x;
          result.y += parentGeo.y;

          parent = parent.getParent();

          parentGeo = parent.getGeometry();
        }
      }
    }

    return result;
  }

  /**
   * Replaces the array of mxPoints in the geometry of the given edge
   * with the given array of mxPoints.
   */
  // setEdgePoints(edge: mxCell, points: Array<mxPoint>): void;
  setEdgePoints(edge, points) {
    if (edge != null) {
      const { model } = this.graph;
      let geometry = edge.getGeometry();

      if (geometry == null) {
        geometry = new Geometry();
        geometry.setRelative(true);
      } else {
        geometry = geometry.clone();
      }

      if (this.parent != null && points != null) {
        const parent = edge.getParent();

        const parentOffset = this.getParentOffset(parent);

        for (let i = 0; i < points.length; i += 1) {
          points[i].x = points[i].x - parentOffset.x;
          points[i].y = points[i].y - parentOffset.y;
        }
      }

      geometry.points = points;
      model.setGeometry(edge, geometry);
    }
  }

  /**
   * Sets the new position of the given cell taking into account the size of
   * the bounding box if {@link useBoundingBox} is true. The change is only carried
   * out if the new location is not equal to the existing location, otherwise
   * the geometry is not replaced with an updated instance. The new or old
   * bounds are returned (including overlapping labels).
   *
   * @param cell {@link mxCell} whose geometry is to be set.
   * @param x Integer that defines the x-coordinate of the new location.
   * @param y Integer that defines the y-coordinate of the new location.
   */
  // setVertexLocation(cell: mxCell, x: number, y: number): mxRectangle;
  setVertexLocation(cell, x, y) {
    const model = this.graph.getModel();
    let geometry = cell.getGeometry();
    let result = null;

    if (geometry != null) {
      result = new Rectangle(x, y, geometry.width, geometry.height);

      // Checks for oversize labels and shifts the result
      // TODO: Use mxUtils.getStringSize for label bounds
      if (this.useBoundingBox) {
        const state = this.graph.getView().getState(cell);

        if (
          state != null &&
          state.text != null &&
          state.text.boundingBox != null
        ) {
          const { scale } = this.graph.getView();
          const box = state.text.boundingBox;

          if (state.text.boundingBox.x < state.x) {
            x += (state.x - box.x) / scale;
            result.width = box.width;
          }

          if (state.text.boundingBox.y < state.y) {
            y += (state.y - box.y) / scale;
            result.height = box.height;
          }
        }
      }

      if (this.parent != null) {
        const parent = cell.getParent();

        if (parent != null && parent !== this.parent) {
          const parentOffset = this.getParentOffset(parent);

          x -= parentOffset.x;
          y -= parentOffset.y;
        }
      }

      if (geometry.x !== x || geometry.y !== y) {
        geometry = geometry.clone();
        geometry.x = x;
        geometry.y = y;

        model.setGeometry(cell, geometry);
      }
    }

    return result;
  }

  /**
   * Returns an {@link Rectangle} that defines the bounds of the given cell or
   * the bounding box if {@link useBoundingBox} is true.
   */
  // getVertexBounds(cell: mxCell): mxRectangle;
  getVertexBounds(cell) {
    let geo = cell.getGeometry();

    // Checks for oversize label bounding box and corrects
    // the return value accordingly
    // TODO: Use mxUtils.getStringSize for label bounds
    if (this.useBoundingBox) {
      const state = this.graph.getView().getState(cell);

      if (
        state != null &&
        state.text != null &&
        state.text.boundingBox != null
      ) {
        const { scale } = this.graph.getView();
        const tmp = state.text.boundingBox;

        const dx0 = Math.max(state.x - tmp.x, 0) / scale;
        const dy0 = Math.max(state.y - tmp.y, 0) / scale;
        const dx1 =
          Math.max(tmp.x + tmp.width - (state.x + state.width), 0) / scale;
        const dy1 =
          Math.max(tmp.y + tmp.height - (state.y + state.height), 0) / scale;

        geo = new Rectangle(
          geo.x - dx0,
          geo.y - dy0,
          geo.width + dx0 + dx1,
          geo.height + dy0 + dy1
        );
      }
    }

    if (this.parent != null) {
      const parent = cell.getParent();
      geo = geo.clone();

      if (parent != null && parent !== this.parent) {
        const parentOffset = this.getParentOffset(parent);
        geo.x += parentOffset.x;
        geo.y += parentOffset.y;
      }
    }

    return new Rectangle(geo.x, geo.y, geo.width, geo.height);
  }

  /**
   * Function: arrangeGroups
   *
   * Shortcut to <mxGraph.updateGroupBounds> with moveGroup set to true.
   */
  arrangeGroups(
    cells,
    border,
    topBorder,
    rightBorder,
    bottomBorder,
    leftBorder
  ) {
    return this.graph.updateGroupBounds(
      cells,
      border,
      true,
      topBorder,
      rightBorder,
      bottomBorder,
      leftBorder
    );
  }
}

export default mxGraphLayout;
