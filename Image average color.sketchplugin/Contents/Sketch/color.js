
@import 'helpers/settings.js'

var color = {

    calculateAverageColorFromImage: function(context) {

        var doc = context.document;
        var selectedLayers = context.selection;

        if (selectedLayers.count() == 0) {
          settings.alert('No layers are selected. Please, select an image and try again','Select a layer');
          return;
        } 
        
        var layer = selectedLayers[0];

        if (![layer isKindOfClass:[MSLayer class]] || ![layer isKindOfClass:[MSBitmapLayer class]] ) {
            settings.alert('The selected layer is not a bitmap image. Please, select an image and try again','Select an image');
            return;
        } 

        var image = layer.NSImage();
        
        var rep = image.representations().firstObject();
        var averageColorFromImage =  color.averageColorFromImage(image);

        return averageColorFromImage;
    },

    // Fill a layer from an image average color
    
    fillAverageColor: function(context) {

        var doc = context.document;
        var pages = doc.pages();
        var handlerManager = doc.eventHandlerManager();
        var normalHandler = handlerManager.normalHandler();
        var selectedRect = normalHandler.selectedRect();
        var selectedLayers = context.selection;

        if (selectedLayers.count() == 0) {
            settings.alert('No layers are selected.'); 
            return;
        } 

        if (selectedLayers.count() > 1) {
            settings.alert('Oops, you have more than one selected layer. Please, select just the layer you want to be filled and try again','Select just one layer');
            return;
        };

        var layerSelected = selectedLayers[0];

        var allLayers = [NSMutableArray new];
        
        for (var i = 0; i < pages.count(); i++) {
            var layers = pages[i].children();
            for (var j = 0; j < layers.count(); j++) {
                [allLayers addObject:layers[j]];
            };
        };

        if (allLayers.count() < 2) {
          settings.alert('There is not any layer where taking the average color from. You should have at least one image where to take the average color from','Lack of layers'); 
          return;
        };
                      
        if ( ![layerSelected isKindOfClass:[MSLayer class]] || [layerSelected isKindOfClass:[MSBitmapLayer class]] || [layerSelected isKindOfClass:[MSPage class]]) {
            settings.alert('Selected layer is not an editable layer. Please, select an editable layer and try again','Select a layer');
            return;
        };

        var layersNames = [NSMutableArray new];
        for (var i = 0; i < allLayers.count(); i++) {
            [layersNames addObject:allLayers[i].name()];
        };

        var callback = settings.getSelectedItemFromSelect('Choose the image where you want to get the average color from',layersNames, 1)

        var responseCode = callback[0];
        if (responseCode != 1000) {
            settings.alert('An unexpected error has occurred. Please, select an image and try again.')
            return;
        };

        var imageToGetAverageColorNameIndex = callback[1];

        var selectedImageLayer =  allLayers[imageToGetAverageColorNameIndex];

        if (![selectedImageLayer isKindOfClass:[MSLayer class]] || ![selectedImageLayer isKindOfClass:[MSBitmapLayer class]] ) {
            settings.alert('Selected layer is not an editable layer. Please, select an editable layer and try again','Select a layer');
            return;
        }

        var imageToGetAverageColor = selectedImageLayer.NSImage();

        var averageColor = color.averageColorFromImage(imageToGetAverageColor);

        if (averageColor == nil) {
            settings.alert('An unexpected error has occurred. Please, selecte a image and try again.')
            return;
        };

        var fills = layerSelected.style().fills();
        
        for (var i = 0; i < fills.count(); i++) {
            var fill = fills.objectAtIndex(i)
            
            if (fill.fillType() == 0 && fill.isEnabled()) {
                fillObj = fill
                log(fill)
            }
        }

        if (fillObj == nil) {
            settings.alert('The background fill of this layer can not be edited. Please, select an editable layer and try again','Select a editable layer');
            return;
        };
        
        fillObj.setColor(averageColor);
    },

    // Helper to calculate the average color of an image

    averageColorFromImage: function(image) {

        var imageRep = image.representations().firstObject();
        var pixelWidth = imageRep.pixelsWide();
        var pixelHeight = imageRep.pixelsHigh();
        var r = 0, g = 0, b = 0;
        var numberOfPixelsCounted = 0;
        var xPixelSpace = 10;
        var yPixelSpace = 10;
        var color;

        for (var x = 0; x < pixelWidth - xPixelSpace; x+= xPixelSpace) {
            for (var y = 0; y < pixelHeight - yPixelSpace; y+= yPixelSpace) {
                color = [imageRep colorAtX:x y:y];
                r += color.redComponent();
                g += color.greenComponent();
                b += color.blueComponent();
                numberOfPixelsCounted++;
            };
        };

        return [MSColor colorWithRed:r/numberOfPixelsCounted green:g/numberOfPixelsCounted blue:b/numberOfPixelsCounted alpha:1.0];
    }
};
