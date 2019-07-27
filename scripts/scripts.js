$(document).ready(function(){
	
	var table = $("#market_tbody");
	var rowTemplate = $("#table_row").html();

	var totalAmountTemplate = $("#total_amount").html();
	var amount = $("#totals");
	
	// add_market_launch button event handler
	$("#add_market_launch").button().on("click", function() {
		showModal(null, "New Market Launch");
	});

	//row buttons event handler
	$("#market").on("click", ".row-button", function() {
		var role = $(event.target).data("role");
		var id = $(event.target).parent().data("row_id");

		if (role == "edit") {
			editTableRow(id);
		} else if (role == "delete") {
			deleteTableRow(id);
		}
	});

	// init modal window
	var Modal = $("#dialog_form1").dialog({
		modal: true,
		autoOpen: false,
		height: 600,
		width: 500,
		buttons: {
			"Submit": function() {
				if (myValidator.valid()) {
					newItem()
				}
			},
			"Cancel": function() {
				closeModal();
			}
		}
	});
	init();

	// jquery validator
	$("#myDialog_form").validate({
		rules: {
		    title: {
		    	required: true,
		    	minlength: 3
		    },
		    estimated_sales_amount: {
		    	number: true,
		      	required: true
		    }
		}
	});
	var myValidator = $("#myDialog_form");
	myValidator.validate();
	
	function init() {
		// localStorage.clear();
		redrawTable();

		// init select_menu_in_modal_window
		$("#launch_timeframe1").selectmenu();
		$("#launch_timeframe2").selectmenu();
		$("#win_confidential")
			.selectmenu()
			.selectmenu("menuWidget")
			.addClass("overflow");

			closeModal();

		// init rowTemplate	
		Mustache.parse(rowTemplate);
	}

	// adding or editing item
	function newItem() {
		var marketId = $("#market-launch-id").val();
		if (marketId == undefined || marketId == "") {
			marketId = "ML" + Date.now();
			marketId = "ML" + marketId.toString().slice(10,13); 
		} else{
			localStorage.removeItem(marketId);
		};

		var fieldsValue = {
			id : 										marketId,
			title : 									$("#title").val(),
			brand : 									$("#brand").val(),
			launch_timeframe : 							$("#launch_timeframe1").val() + " " + $("#launch_timeframe2").val(),
			estimated_sales_amount : 					$("#estimated_sales_amount").val(),
			CHF : 										$("#estimated_sales_amount").val() / 1.1,
			win_confidential: 							$("#win_confidential").val()
		};

		// set new Item in localStorage
		localStorage.setItem(marketId, JSON.stringify(fieldsValue));

		closeModal();
		redrawTable();
	}

	function editTableRow(id) {
		element = JSON.parse(localStorage.getItem(id));
		showModal(element, "Edit Market Launch");
	}

	function deleteTableRow(id) {
		var Modal1 = $("#dialog_form2").dialog({
			modal: true,
			autoOpen: false,
			height: 200,
			width: 600,
			buttons: {
				Submit: function() {
					localStorage.removeItem(id);
					$( this ).dialog( "close" );
					redrawTable();;
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
		Modal1.dialog("open");
	}

	function redrawTable() {
		var data = [];
		var OfMarketLaunches = localStorage.length;

		var regionalTotalAmount = 0;
		var globalTotalAmount = 0;

		if(OfMarketLaunches > 0){
			for(var i=0; i < OfMarketLaunches; i++) {
				data.push(JSON.parse(localStorage[localStorage.key(i)]));
				regionalTotalAmount += parseInt(data[i].estimated_sales_amount);
				globalTotalAmount += parseFloat(data[i].CHF);
			}
			var itemValues = {
				OfMarketLaunches : OfMarketLaunches,
				regionalTotalAmount : regionalTotalAmount,
				globalTotalAmount : globalTotalAmount
			};
			table.html(Mustache.render(rowTemplate,{"rows": data}));
			amount.html(Mustache.render(totalAmountTemplate, {"total": itemValues}));
		} else {
			table.html('');
		}
	}

	function showModal(element, title) {
		if (!(title == null || title == undefined)) {
			title = "New Market Launch";
		}
		if (!(element == null || element == undefined)) {
			$("#market-launch-id").val(element.id);
			$("#title").val(element.title);
			$("#brand").val(element.brand);
			$("#launch_timeframe1").val(element.launch_timeframe1);
			$("#launch_timeframe2").val(element.launch_timeframe2);
			$("#estimated_sales_amount").val(element.estimated_sales_amount);
			$("#win_confidential").val(element.win_confidential);

			$("#launch_timeframe1").selectmenu("refresh");
			$("#launch_timeframe2").selectmenu("refresh");
			$("#win_confidential").selectmenu("refresh");
		}
		Modal.dialog().dialog("open");
	}

	function closeModal() {
		$("#market-launch-id").val("");
		$("#title").val("");
		$("#brand").val("");
		$("#launch_timeframe1").val("");
		$("#launch_timeframe2").val("");
		$("#estimated_sales_amount").val("");
		$("#win_confidential").val("");

		$("#launch_timeframe1").selectmenu("refresh");
		$("#launch_timeframe2").selectmenu("refresh");
		$("#win_confidential").selectmenu("refresh");
		Modal.dialog("close");
	}
});

