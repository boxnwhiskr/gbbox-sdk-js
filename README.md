Javascript SDK for gbbox.

## Example

For all pages:

    var gbbox = _gbbox.API('http://ENDPOINT', 'TOKEN');
    gbbox.sendPageview();

For a page with ongoing experiment:

    var gbbox = _gbbox.API('http://ENDPOINT', 'TOKEN');
    gbbox.sendPageview();
    gbbox.route(['exp1', 'exp2'], function(assignments) {
        // Do something with assginments
    });

