## TODO

* Generate tid
* Store tid using cookie
* Call collection API
* Call routing API

## Example

For all pages:

    var gbbox = GBBOX('TOKEN');
    gbbox.sendPageview();

For a page with ongoing experiment:

    var gbbox = GBBOX('TOKEN');
    gbbox.sendPageview();
    gbbox.route(['exp1', 'exp2'], function(assignments) {
        // Do something with assginments
    });

