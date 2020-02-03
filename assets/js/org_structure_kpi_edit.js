$(function($) {
    var selectedNode = '';
    var ds = {
        'dept': 'management',
        'description': 'Key business process with completed quality review',
        'actual': '$ 12894.2',
        'target': '$ 13894.2',
        'gap': '$ 10000.2',
        'id': '1',
        'children': [{
            'dept': 'management',
            'description': 'Key business process with completed quality review',
            'actual': '$ 12894.2',
            'target': '$ 13894.2',
            'gap': '$ 10000.2',
            'id': '2',
        }, {
            'dept': 'management',
            'description': 'Key business process with completed quality review',
            'actual': '$ 12894.2',
            'target': '$ 13894.2',
            'gap': '$ 10000.2',
            'id': '3',
            'children': [{
                'dept': 'management',
                'description': 'Key business process with completed quality review',
                'actual': '$ 12894.2',
                'target': '$ 13894.2',
                'gap': '$ 10000.2',
                'id': '4',
            }, {
                'dept': 'management',
                'description': 'Key business process with completed quality review',
                'actual': '$ 12894.2',
                'target': '$ 13894.2',
                'gap': '$ 10000.2',
                'id': '5',
                'children': [{
                    'dept': 'management',
                    'description': 'Key business process with completed quality review',
                    'actual': '$ 12894.2',
                    'target': '$ 13894.2',
                    'gap': '$ 10000.2',
                    'id': '6',
                }, {
                    'dept': 'management',
                    'description': 'Key business process with completed quality review',
                    'actual': '$ 12894.2',
                    'target': '$ 13894.2',
                    'gap': '$ 10000.2',
                    'id': '7',
                }]
            }]
        }, {
            'dept': 'management',
            'description': 'Key business process with completed quality review',
            'actual': '$ 12894.2',
            'target': '$ 13894.2',
            'gap': '$ 10000.2',
            'id': '8',
        }, {
            'dept': 'management',
            'description': 'Key business process with completed quality review',
            'actual': '$ 12894.2',
            'target': '$ 13894.2',
            'gap': '$ 10000.2',
            'id': '9'
        }]
    };


    var getId = function() {
        return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
    };

    var oc = $('#chart-container').orgchart({
        'data': ds,
        'chartClass': 'edit-state',
        'exportButton': true,
        'nodeContent': 'title',
        'direction': 'l2r',
        'exportFilename': 'OrgChart',
        'parentNodeSymbol': 'fa-th-large',
        'createNode': function($node, data) {
            $node[0].id = getId();
        }
    });


    $('body').on('click', '.orgiz_edit', function() {
        $('.edit_org_structure-sidebar').css('right', 0);
        $('.add_org_structure-sidebar').css('right', '-300px');
    });

    $('body').on('click', '.orgiz_add', function() {
        $('.add_org_structure-sidebar').css('right', 0);
        $('.edit_org_structure-sidebar').css('right', '-300px');
    });

    $('body').on('click', '#close-org-aside', function() {
        $('.edit_org_structure-sidebar').css('right', '-300px');
    });

    $('body').on('click', '#close-org-aside1', function() {
        $('.add_org_structure-sidebar').css('right', '-300px');
    });

    oc.$chartContainer.on('click', '.node', function() {
        var $this = $(this);
        selectedNode = $this;
        $('#selected-node').val($this.find('.orgiz_name').html()).data('node', $this);
        $('#org_new_id').val($this.find('.org_id').val()).data('node', $this);
        $('#desc').val($this.find('.org_kpi_description').html()).data('node', $this);
        $('#dept').val($this.find('.org_kpi_deparment').html()).data('node', $this);
        $('#actual').val($this.find('.org_kpi_actual_value').html()).data('node', $this);
        $('#target').val($this.find('.org_kpi_target_value').html()).data('node', $this);
        $('#gap').val($this.find('.gap_value').html()).data('node', $this);
    });

    oc.$chartContainer.on('click', '.orgchart', function(event) {
        if (!$(event.target).closest('.node').length) {
            $('#selected-node').val('');
        }
    });


    // Add function
    $('body').on('click', '#add-org-object', function() {
        var $chartContainer = $('#chart-container');
        var nodeVals = [];

        var desc1 = $('#desc1').val();
        var dept1 = $('#dept1').val();
        var actual = $('#actual1').val();
        var target = $('#target1').val();
        var gap = $('#gap1').val();

        $('#new-nodelist').find('.new-node').each(function(index, item) {
            var validVal = item.value.trim();
            if (validVal.length) {
                nodeVals.push(validVal);
            }
        });

        // var $node = $('#selected-node').data('node');
        var $node = selectedNode;

        // var nodeType = $('input[name="node-type"]:checked');
        var nodeType = 'children';

        if (!$('.orgchart').length) {
            alert('Please create the root node firstly when you want to build up the orgchart from the scratch');
            return;
        }
        if (!$node) {
            alert('Please select one node in orgchart');
            return;
        }

        var hasChild = $node.parent().attr('colspan') > 0 ? true : false;
        if (!hasChild) {
            var rel = nodeVals.length > 1 ? '110' : '100';
            oc.addChildren($node, [{
                'dept': dept1,
                'description': desc1,
                'actual': actual,
                'target': target,
                'gap': gap,
                'relationship': rel,
                'id': getId()
            }]);
        } else {
            oc.addSiblings($node.closest('tr').siblings('.nodes').find('.node:first'), [{
                'dept': dept1,
                'description': desc1,
                'actual': actual,
                'target': target,
                'gap': gap,
                'relationship': '110',
                'id': getId()
            }]);
        }


        $('#desc1, #dept1, #actual1, #target1, #gap1').val('');

        $('.add_org_structure-sidebar').css('right', '-300px');

    });


    // Edit Function
    $('body').on('click', '#edit-org-object', function() {
        var id = $('#org_new_id').val();
        var desc = $('#desc').val();
        var dept = $('#dept').val();
        var actual = $('#actual').val();
        var target = $('#target').val();
        var gap = $('#gap').val();

        const checkAndChange = (obj) => {
            if (id == obj.id) {
                obj.dept = dept;
                obj.description = desc;
                obj.actual = actual;
                obj.target = target;
                obj.gap = gap;
            }
        }

        const recursion = (obj) => {
            const o = obj;
            checkAndChange(o);
            var childEl = o.children;
            if (o.children) {
                if (childEl.length > 0) {
                    childEl.forEach(v => {
                        recursion(v);
                    });
                }
            }

            return o;
        }
        let newData = recursion(ds);
        oc.init({
            'data': newData
        });

        $('.edit_org_structure-sidebar').css('right', '-300px');
    });

    //Delete function
    $('body').on('click', '.orgiz_delete', function() {
        // var $node = $('#selected-node').data('node');
        var $node = $(this).parent().parent();
        if (!$node) {
            alert('Please select one node in orgchart');
            return;
        } else if ($node[0] === $('.orgchart').find('.node:first')[0]) {
            if (!window.confirm('Are you sure you want to delete the whole chart?')) {
                return;
            }
        }
        oc.removeNodes($node);
        $('#selected-node').val('').data('node', null);
    });

    //Org box button function
    $('body').on('mouseenter', ".orgiz_btn_scorecard, .orgiz_btn_kpi, .orgiz_btn_init, .orgiz_btn_appraisal", function() {
        $(this).css("border-radius", "6px");
        $(this).css("width", "dd");
        $(this).css("height", "dd");
    });

    $('body').on('mouseleave', ".orgiz_btn_scorecard, .orgiz_btn_kpi, .orgiz_btn_init, .orgiz_btn_appraisal", function() {
        $(this).css("border-radius", "50%");

    });
});