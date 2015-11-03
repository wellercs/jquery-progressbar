// ProgressBar v1.0 - jQuery progressbar plugin
// (c) 2013 Chris Weller
// License: http://www.apache.org/licenses/LICENSE-2.0
(function($){
	$.progressbar = function(options) {
		var
			defaults = {
				urlPath: '',
				checkInterval: 1000,
				animationDuration: 500,
				dialogModal: true,
				dialogCloseOnEscape: false,
				dialogDraggable: false,
				dialogResizable: false,
				dialogHeight: 75,
				dialogWidth: 425,
				dialogAutoOpen: false,
				dialogTitle: 'Please wait...',
				displayPercentageInProgressBar: true,
				progressBarDialogElement: '#progressBarDialog',
				progressBarElement: '#progressBar',
				actionButtonClass: '.action-button',
				submitButtonElement: '#btnSubmit',
				userMessageDivElement: '#usermessagediv',
				userMessageULElement: '#usermessageul',
				userMessageErrorClass: 'failure',
				userMessageErrorMessage: 'An error occurred.',
				bomb: false,
				exit: false,
				onProgressBarComplete: function() {}			
			},
			settings = $.extend({}, defaults, options);
		
		if (settings.bomb) {
			interruptAndError();
		}
		else if (settings.exit) {
			exitProgressBar();
		}
		else {
			init();
		}
		
		function init() {
			var progressBarPercent = 0, progressBarTimer, progressBarWidth;
			disableActionButtons($(settings.actionButtonClass));
			initDialog(settings);
			openDialog($(settings.progressBarDialogElement));
			showProgressBar($(settings.progressBarElement));
			checkProgress(settings);
			setTimerInterval(settings.checkInterval);
		}
		
		function disableActionButtons(myActionButtonClass) {
			myActionButtonClass.attr("disabled","disabled");
		}
	
		function initDialog(opts) {
			if (opts === undefined) {
				opts = settings;
			}
			
			$(opts.progressBarDialogElement).dialog({
				modal: opts.dialogModal,
				closeOnEscape: opts.dialogCloseOnEscape,
				draggable: opts.dialogDraggable,
				resizable: opts.dialogResizable,
				height: opts.dialogHeight,
				width: opts.dialogWidth,
				autoOpen: opts.dialogAutoOpen,
				title: opts.dialogTitle
			});
		}
		
		function openDialog(myProgressBarDialogElement) {
			myProgressBarDialogElement.dialog("open");
		}
		
		function showProgressBar(myProgressBarElement) {
			myProgressBarElement.show();
		}
		
		function checkProgress(opts) {
			if (opts === undefined) {
				opts = settings;
			}
			
			var d = new Date();
			var t = d.getTime();
			var checkProgressURL = opts.urlPath;
			checkProgressURL += "&t=" + t;
			
			$.get(checkProgressURL,{},function (data,textStatus) {
				progressBarPercent = parseInt($.trim(data));
				progressBarWidth = progressBarPercent * $(opts.progressBarElement).width() / 100;
				animateProgressBar(opts);
				if(progressBarPercent == 100) {
					exitProgressBar(opts);
				}
			})
		}
		
		function animateProgressBar(opts) {
			if (opts === undefined) {
				opts = settings;
			}
			
			if(opts.displayPercentageInProgressBar) {
				$(opts.progressBarElement).find("div").animate({ width: progressBarWidth }, opts.animationDuration).html(progressBarPercent + "%&nbsp;");
			} else {
				$(opts.progressBarElement).find("div").animate({ width: progressBarWidth }, opts.animationDuration);
			}
		}
		
		function clearTimerInterval() {
			clearInterval(progressBarTimer);
		}
		
		function closeDialog(myProgressBarDialogElement) {
			myProgressBarDialogElement.dialog("close");
		}
		
		function removeDisabledAttribute(myDisabled) {
			myDisabled.removeAttr("disabled");
		}
		
		function setTimerInterval(myCheckInterval) {
			progressBarTimer = setInterval(checkProgress, myCheckInterval);
		}
		
		function setUserMessageClass(myUserMessageDiv, myUserMessageClass) {
			myUserMessageDiv.attr("class", myUserMessageClass);
		}
		
		function setUserMessage(myUserMessageUL, myUserMessage) {
			myUserMessageUL.html('<li>' + myUserMessage + '</li>');
		}
		
		function scrollToTop() {
			window.scrollTo(0, 0);
		}
		
		function exitProgressBar(opts) {
			if (opts === undefined) {
				opts = settings;
			}
			
			clearTimerInterval();
			removeDisabledAttribute($(opts.actionButtonClass));
			closeDialog($(opts.progressBarDialogElement));
			opts.onProgressBarComplete.call(this);
		}
		
		function interruptAndError(opts) {
			if (opts === undefined) {
				opts = settings;
			}
			
			clearTimerInterval();
			closeDialog($(opts.progressBarDialogElement));
			setUserMessageClass($(opts.userMessageDivElement), opts.userMessageErrorClass);
			setUserMessage($(opts.userMessageULElement), opts.userMessageErrorMessage);
			scrollToTop();			
		}
		
		// returns the jQuery object to allow for chainability
		return this;
	}
})(jQuery);