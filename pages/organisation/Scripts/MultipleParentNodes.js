var AbstractionLayer = MindFusion.AbstractionLayer;
var AnchorPattern = MindFusion.Diagramming.AnchorPattern;
var AnchorPoint = MindFusion.Diagramming.AnchorPoint;
var DiagramNode = MindFusion.Diagramming.DiagramNode;
var DiagramLink = MindFusion.Diagramming.DiagramLink;
var ContainerNode = MindFusion.Diagramming.ContainerNode;
var ShapeNode = MindFusion.Diagramming.ShapeNode;
var Style = MindFusion.Diagramming.Style;
var Theme = MindFusion.Diagramming.Theme;
var FontStyle = MindFusion.Drawing.FontStyle;
var Font = MindFusion.Drawing.Font;
var Alignment = MindFusion.Diagramming.Alignment;
var HandlesStyle = MindFusion.Diagramming.HandlesStyle;
var Events = MindFusion.Diagramming.Events;
var Diagram = MindFusion.Diagramming.Diagram;
var NodeListView = MindFusion.Diagramming.NodeListView;
var Rect = MindFusion.Drawing.Rect;
var Shape = MindFusion.Diagramming.Shape;
var DashStyle = MindFusion.Drawing.DashStyle;
var Point = MindFusion.Drawing.Point;
var FlowchartLayout = MindFusion.Graphs.FlowchartLayout;
var Size = MindFusion.Drawing.Size;

var diagram, nodeList;
var backgroundColor, linkDashStyle, baseShape, headShape, headBrush;
var customFontColor = '#ffffff';
var customBorderColor = "#000000";

window.onload = function(e){ 

	backgroundColor = "#151515";

	var colorBkgr = document.querySelector("#colorBkgr");
	colorBkgr.value = backgroundColor;
	colorBkgr.addEventListener("input", updateBackground, false);
	colorBkgr.addEventListener("change", updateBackground, false);  
	
	var colorFont = document.querySelector("#colorFont");
	colorFont.addEventListener("input", updateFontColor, false);
	colorFont.addEventListener("change", updateFontColor, false);

	var colorBorder = document.querySelector("#colorBorder");
	colorBorder.addEventListener("input", updateBorderColor, false);
	colorBorder.addEventListener("change", updateBorderColor, false);

	var diagramEl = document.getElementById('diagram');
	// create a Diagram component that wraps the "diagram" canvas
	diagram = AbstractionLayer.createControl(Diagram, null, null, null, diagramEl);
	diagram.setAllowInplaceEdit(true);
	diagram.setRouteLinks(true);
	diagram.setShowGrid(true);
	diagram.setRoundedLinks(true);
	diagram.setBounds(new Rect(0, 0, 2000,2500));
	
	var theme = new Theme();	
	var linkStyle = new Style();
	linkStyle.setStroke("#a6a6a6");
	linkStyle.setTextColor("#585A5C");
	linkStyle.setFontName("Verdana");
	linkStyle.setFontSize(3);
	theme.styles["std:DiagramLink"] = linkStyle;
	diagram.setTheme(theme);
	
	
	diagram.addEventListener(Events.linkCreated, onLinkCreated);
	diagram.addEventListener(Events.nodeCreated, onNodeCreated);
	var nodeListEl = document.getElementById('nodeList');
	// create an NodeListView component that wraps the "nodeList" canvas
	nodeList = AbstractionLayer.createControl(NodeListView, null, null, null, nodeListEl);	
	nodeList.setIconSize(new Size(30,30));
	nodeList.setDefaultNodeSize(new Size(10,10));
	nodeList.addEventListener(Events.nodeSelected, onShapeSelected);
	
	 var node = new ShapeNode();	
	 node.setTransparent(true);
	 node.setText("Text");
	 node.setFont(new Font("Verdana", 12));
	 nodeList.addNode(node, "Text");  	 
	 
	 node = new ContainerNode();
	 node.setCaptionBackBrush({ type: 'SolidBrush', color: '#88b663' });
	 node.setBrush({ type: 'SolidBrush', color: '#ffffff' });
	 nodeList.addNode(node, "Container");	
	 
	diagram.setDefaultShape(node.getShape());

	for (var shapeId in Shape.shapes)
	{
		// skip some arrowhead shapes that aren't that useful as node shapes
		var shape = Shape.shapes[shapeId];
		console.log(shape.id, shape);
		if (!shapeId.startsWith("Bpmn") && ['Text', 'Container', 'Arrow3', 'Circle', 'ExternalProcess'].indexOf(shape.id) !== -1)
		{
		   var node = new MindFusion.Diagramming.ShapeNode(diagram);
		   node.setShape(shapeId);
		   node.setBrush({ type: 'SolidBrush', color: '#88b663' });
		   nodeList.addNode(node, shapeId.toString());
		}
	}		
	
	// onLoaded();

};

function onLoaded()
{
	var nodes = {};
	
	for(var i = 0; i < 5; i++)
	{
		nodes[i] = diagram.getFactory().createShapeNode(new Rect(20, 20, 20, 12));
		nodes[i].setShape('Rectangle');
	    nodes[i].setBrush({ type: 'SolidBrush', color: '#567939' });
	};
	
	var node5 = diagram.getFactory().createShapeNode(new Rect(20, 20, 20, 12 ));
	node5.setShape('Rectangle');
	node5.setBrush({ type: 'SolidBrush', color: '#6f9c49' });
	

	for(var i = 0; i < 5; i++)
	{ 
        var link = diagram.getFactory().createDiagramLink(nodes[i], node5);	
		link.setHeadShape("Triangle");
		link.setText("20%");
	    link.setHeadShapeSize(3.0);
	    link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	};
	

	
	//second layer
	for(var i = 0; i < 3; i++)
	{
		nodes[i] = diagram.getFactory().createShapeNode(new Rect(20, 20, 20, 12));
		nodes[i].setShape('Rectangle');
	    nodes[i].setBrush({ type: 'SolidBrush', color: '#88b663' });
	};		
	
	for(var i = 0; i < 3; i++)
	{ 
        var link = diagram.getFactory().createDiagramLink(node5, nodes[i]);	
		link.setHeadShape("Triangle");
		link.setText("33.33%");
	    link.setHeadShapeSize(3.0);
	    link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	};
	
	
	//third layer
	for(var i = 3; i < 9; i++)
	{ 
		nodes[i] = diagram.getFactory().createShapeNode(new Rect(20, 20, 20, 12));
		nodes[i].setShape('Rectangle');
	    nodes[i].setBrush({ type: 'SolidBrush', color: '#a3c686' });		
      
	};
	
	for(var i = 0; i < 3; i++)
	{
		for(var j=3+i*2; j < 5+i*2; j++)
		{
	      var link = diagram.getFactory().createDiagramLink(nodes[i], nodes[j]);	
		  link.setHeadShape("Triangle");
		  link.setText("50%");
	      link.setHeadShapeSize(3.0);
	      link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
		}
	}	
	
	//fourth layer
	
	//create the children with multiple parents
	for(var i = 0; i < 3; i++)
	{
		nodes[i] = diagram.getFactory().createShapeNode(new Rect(20, 20, 20, 12));
		nodes[i].setShape('Rectangle');
	    nodes[i].setBrush({ type: 'SolidBrush', color: '#bdd6a8' });
	};		
	
	nodes[2].setBrush({ type: 'SolidBrush', color: '#e4efdc' });
	
	for(var i = 0; i < 2; i++)
	{
		for(var j = 3; j < 6; j++)
		{
		 var link = diagram.getFactory().createDiagramLink(nodes[j + i * 3], nodes[i]);	
		  link.setHeadShape("Triangle");
		  var label = link.addLabel("33.33%");
		  label.setAutoArrange(true);
	      link.setHeadShapeSize(3.0);
	      link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
		}
	}
	
	for(var i = 0; i < 2; i++)
	{
		var link = diagram.getFactory().createDiagramLink(nodes[i], nodes[2]);	
		  link.setHeadShape("Triangle");
		  var label = link.addLabel("50%");
		  label.setAutoArrange(true);
	      link.setHeadShapeSize(3.0);
	      link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	}
	
	
	// arrange the tree
	var fLayout = new FlowchartLayout();
	fLayout.setOrientation(MindFusion.Graphs.Orientation.Vertical);	
	
	var lLayout = new MindFusion.Graphs.LayeredLayout();
	diagram.arrange(lLayout);
	
	
	var middleNodeBounds = diagram.nodes[2].getBounds();
	
	var lastNodeBounds = diagram.nodes[diagram.nodes.length - 1].getBounds();
	diagram.nodes[diagram.nodes.length - 1].setBounds(new Rect(middleNodeBounds.x, lastNodeBounds.y, lastNodeBounds.width, lastNodeBounds.height), true);
	diagram.routeAllLinks();
	diagram.resizeToFitItems();	
	
	onSequence();

}

function arrange()
{
	var lLayout = new MindFusion.Graphs.LayeredLayout();
	diagram.arrange(lLayout);
	diagram.routeAllLinks();
	
	var cBounds = diagram.getContentBounds();
	
	if(cBounds.width > diagram.getBounds().width || cBounds.height > diagram.getBounds().height)
	diagram.resizeToFitItems();	
//	diagram.setBounds(new Rect(0, 0, 2000,2000));
}

function clearItems()
{
	diagram.clearAll();
}

function save()
{
	console.log(diagram.toJson());
	localStorage.setItem('bpmn', diagram.toJson());
}

function load()
{
	var bpmn = localStorage.getItem('bpmn');
	if(bpmn)
		diagram.fromJson(bpmn);
}


function updateBackground(event) {
   backgroundColor = event.target.value;
   var items = diagram.selection.items || [];
   console.log('updateBackground', items);
   for (const item of items) {
	item.setBrush({ type: 'SolidBrush', color: backgroundColor }); 
   }
	//    var selectedItem = diagram.selection.items[0];
	// 	if(selectedItem) 
	// 		selectedItem.setBrush({ type: 'SolidBrush', color: backgroundColor });  
}

function updateFontColor(event) {
	customFontColor = event.target.value;
	var items = diagram.selection.items || [];
   for (const item of items) {
	item.setTextColor(customFontColor);  
   }

	// console.log(customFontColor, diagram.selection);
	// var selectedItem = diagram.selection.items[0];
	//  if(selectedItem) 
	// 	 selectedItem.setTextColor(customFontColor);  
 }

 function updateBorderColor(event) {
	customBorderColor = event.target.value;
	var items = diagram.selection.items || [];
   for (const item of items) {
	item.setStroke(customBorderColor);  
   }  
 }

function onSequence()
{
	var btnSrc = document.getElementById("sequence").src; 	
	linkDashStyle = DashStyle.Solid;
	headShape = "Triangle";
	baseShape = null;
	headBrush = "#7F7F7F";
	document.getElementById("sequence").src = "images/strategy-map/sequenceOn.png";
	// document.getElementById("message").src = "messageOff.png";
	// document.getElementById("association").src = "associationOff.png";
}

function onMessage()
{
	var btnSrc = document.getElementById("message").src; 
	linkDashStyle = DashStyle.Dash;
	headShape = "Triangle";
	baseShape = "Circle";
	headBrush = "white";
	// document.getElementById("message").src = "messageOn.png";
	document.getElementById("sequence").src = "images/strategy-map/sequenceOff.png";
	// document.getElementById("association").src = "associationOff.png";
		
}

function onAssociation()
{
	var btnSrc = document.getElementById("association").src; 
	linkDashStyle = DashStyle.Dash;
	headShape = null;
	baseShape = null;
	// document.getElementById("association").src = "associationOn.png";
	document.getElementById("sequence").src = "images/strategy-map/sequenceOff.png";
	// document.getElementById("message").src = "messageOff.png";
		
}

function onNodeCreated(sender, args)
{
	var node = args.getNode();
	node.setBrush({ type: 'SolidBrush', color: backgroundColor });
	node.setStroke(customBorderColor);
	
	if( node instanceof ContainerNode )
	{
		node.setCaptionBackBrush({ type: 'SolidBrush', color: backgroundColor });
	    node.setBrush({ type: 'SolidBrush', color: customFontColor });
	}		
	
}


function onLinkCreated(sender, args)
{
	console.log('onLinkCreated', sender, args);

	var link = args.getLink();
	link.setStrokeDashStyle (linkDashStyle);
	link.setHeadShape(headShape);
	link.setBaseShape(baseShape);
	link.setHeadShapeSize(3.0);
	link.setBaseShapeSize(3.0);
	link.setHeadBrush({ type: 'SolidBrush', color: '#D50707' });
	link.setBaseBrush({ type: 'SolidBrush', color: '#D50707' });
	link.setTextAlignment(MindFusion.Diagramming.Alignment.Near);
}

function onShapeSelected(sender, e)
{
	console.log('onShapeSelected', sender, e);
	var selectedNode = e.getNode();
	if (selectedNode)
		diagram.setDefaultShape(selectedNode.getShape());
}



























































