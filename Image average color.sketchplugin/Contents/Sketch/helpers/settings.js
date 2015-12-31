
var settings = {

    // Show alert message
    alert: function(msg, title) {
        var app = [NSApplication sharedApplication];
        [app displayDialog:msg withTitle:title];
    },

    // Let the user choose an option
    getSelectedItemFromSelect: function(msg, items, selectedItemIndex) {

        selectedItemIndex = selectedItemIndex || 0;

        var accesory = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,300,25));
        accesory.addItemsWithObjectValues(items);
        accesory.selectItemAtIndex(selectedItemIndex);
        accesory.setDelegate(self);


         var alert = NSAlert.alloc().init();
         alert.setMessageText(msg);
         alert.addButtonWithTitle('OK');
         alert.addButtonWithTitle('Cancel');
         alert.setAccessoryView(accesory);

         var responseCode = alert.runModal();
         var selectedItem = accesory.indexOfSelectedItem();
         // var selectedItemTwo = accesoryTwo.indexOfSelectedItem();
         log(responseCode)
         log(selectedItem)
         return [responseCode, selectedItem];
    },

    saveGlobalColor: function(context, color) {

        var app = [NSApplication sharedApplication];
        var appController = app.delegate();
 
        var globalColors =  appController.globalAssets().colors();

        globalColors.addObject(color);
        appController.globalAssets().setPrimitiveColors(globalColors);
        appController.globalAssets().objectDidChange;
    },

    saveDocumentColor: function(context, color) {
        
        var doc = context.document;

        var documentColors = doc.documentData().assets().primitiveColors();
        documentColors.addObject(color);

        doc.documentData().assets().setPrimitiveColors(documentColors); 
    }
};
