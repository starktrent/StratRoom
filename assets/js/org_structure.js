
        $(function($) {
            var selectedNode = '';
            var ds = {
                'name': 'Lao Lao',
                'title': 'general manager',
                'dept': 'Dept1',
                'kpi': 'KPI1',
                'image': '../../assets/images/user/usrbig7.jpg',
                'id': '1',
                'children': [{
                    'name': 'Bo Miao',
                    'title': 'department manager',
                    'dept': 'Dept1',
                    'kpi': 'KPI2',
                    'image': '../../assets/images/user/usrbig10.jpg',
                    'id': '2',
                }, {
                    'name': 'Su Miao',
                    'title': 'department manager',
                    'dept': 'Dept1',
                    'kpi': 'KPI2',
                    'image': '../../assets/images/user/usrbig11.jpg',
                    'id': '3',
                    'children': [{
                        'name': 'Tie Hua',
                        'title': 'senior engineer',
                        'dept': 'Dept3',
                        'kpi': 'KPI8',
                        'image': '../../assets/images/user/usrbig8.jpg',
                        'id': '4',
                    }, {
                        'name': 'Hei Hei',
                        'title': 'senior engineer',
                        'dept': 'Dept1',
                        'kpi': 'KPI4',
                        'image': '../../assets/images/user/usrbig9.jpg',
                        'id': '5',
                        'children': [{
                            'name': 'Pang Pang',
                            'title': 'engineer',
                            'dept': 'Dept2',
                            'kpi': 'KPI1',
                            'image': '../../assets/images/user/usrbig6.jpg',
                            'id': '6',
                        }, {
                            'name': 'Xiang Xiang',
                            'title': 'UE engineer',
                            'dept': 'Dept3',
                            'kpi': 'KPI2',
                            'image': '../../assets/images/user/usrbig3.jpg',
                            'id': '7',
                        }]
                    }]
                }, {
                    'name': 'Hong Miao',
                    'title': 'department manager',
                    'dept': 'Dept2',
                    'kpi': 'KPI2',
                    'image': '../../assets/images/user/usrbig4.jpg',
                    'id': '8',
                }, {
                    'name': 'Chun Miao',
                    'title': 'department manager',
                    'dept': 'Dept5',
                    'kpi': 'KPI6',
                    'image': '../../assets/images/user/usrbig2.jpg',
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
                // 'direction': 'l2r',
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
                $('#upload_link1').prop('src', $this.find('.orgiz_image').attr('src')).data('node', $this);
                $('#org_new_id').val($this.find('.org_id').val()).data('node', $this);
                $('#name_add').val($this.find('.orgiz_name').html()).data('node', $this);
                $('#desg_add').val($this.find('.orgiz_title').html()).data('node', $this);
                $('#dept_add').val($this.find('.orgiz_department').html()).data('node', $this);
                $('#kpi_name_add').val($this.find('.orgiz_kpi_name').html()).data('node', $this);

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

                var name1 = $('#name_add1').val();
                var desg1 = $('#desg_add1').val();
                var dept1 = $('#dept_add1').val();
                var kpi1 = $('#kpi_name_add1').val();

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
                        'name': name1,
                        'title': desg1,
                        'dept': dept1,
                        'kpi': kpi1,
                        'relationship': rel,
                        'id': getId()
                    }]);
                } else {
                    oc.addSiblings($node.closest('tr').siblings('.nodes').find('.node:first'), [{
                        'name': name1,
                        'title': desg1,
                        'dept': dept1,
                        'kpi': kpi1,
                        'relationship': '110',
                        'id': getId()
                    }]);
                }


                $('#name_add1, #desg_add1, #dept_add1, #kpi_name_add1').val('');

                $('.add_org_structure-sidebar').css('right', '-300px');

            });


            // Edit Function
            $('body').on('click', '#edit-org-object', function() {
                var id = $('#org_new_id').val();
                var name = $('#name_add').val();
                var desg = $('#desg_add').val();
                var dept = $('#dept_add').val();
                var kpi = $('#kpi_name_add').val();

                const checkAndChange = (obj) => {
                    if (id == obj.id) {
                        obj.name = name;
                        obj.title = desg;
                        obj.dept = dept;
                        obj.kpi = kpi;
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
            $('body').on('mouseenter', ".orgiz_btn_scorecard, .orgiz_btn_kpi, .orgiz_btn_init, .orgiz_btn_appraisal", function (){
                $(this).css("border-radius", "6px");
                $(this).css("width", "dd");
                $(this).css("height", "dd");
            });

            $('body').on('mouseleave', ".orgiz_btn_scorecard, .orgiz_btn_kpi, .orgiz_btn_init, .orgiz_btn_appraisal", function (){
                $(this).css("border-radius", "50%");

            });                
        });