'use strict';

angular.module('mean.icu.ui.searchlistfilter', [])
.filter('filteringByUpdated', function (SearchService,$location) {
    return function(results) {
        let recycled = false;
        if($location.search() && $location.search().recycled)recycled = true;

        SearchService.filteringResults = SearchService.filteringResults.filter(entity => {
            return recycled ? entity.recycled : !entity.recycled
        });

        let filteringResults = SearchService.filteringResults.map(function(e) {
            let filterDate = new Date(SearchService.filteringByUpdated) ;
            let filterDueDate = new Date(SearchService.filteringByDueDate);
            let entityDate = new Date(e.updated);
            let entityDueDate = new Date();
            if (SearchService.filteringByDueDate && e.due) {
                entityDueDate = new Date(e.due)
            }
            let res = false;
            if (e._type === 'officeDocument')
              e.due = e.created;
            if (SearchService.filteringByDueDate  && e.due){
                if (entityDueDate > filterDueDate && entityDate > filterDate) {
                  res = true;
                }
                else res = false;
            }
            else if (SearchService.filterDateOption && e.startDate){
                let entityStartDate = new Date(e.startDate);
                let entityEndDate = new Date(e.endDate);
                let filterStart = new Date(SearchService.filterDateOption.startDate._d || SearchService.filterDateOption.startDate);
                let filterEnd = new Date(SearchService.filterDateOption.endDate._d || SearchService.filterDateOption.endDate);
                if (entityStartDate >= filterStart && entityEndDate <= filterEnd && entityDate > filterDate) {
                    res = true;
                  }
                  else res = false;
            }

            else if (entityDate > filterDate)
               res = true;
            return res ? e.id : -1 ;
        });

        return results.filter( entity => filteringResults.indexOf(entity.id) > -1);
    };
})
.filter('searchResultsFilter', function (SearchService,$location) {
	return function(results) {
        if ($location.path().split("/").pop() === "recycled")
            SearchService.filteringResults = results;

		let filteringResults = SearchService.filteringResults.map(e => e.id);
        return results.filter( entity => filteringResults.indexOf(entity.id) > -1);
	}
})
.filter('searchResultsLength', function (SearchService) {
    return function() {
        return  SearchService.filteringResults.length;
    }

});
