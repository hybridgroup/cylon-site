var cylon = angular.module("cylon", []);

var SidebarCtrl = function SidebarCtrl($scope, $element) {
  var path = window.location.pathname.replace(/\/$/, ''),
      activeTab = '';

  // see if a link in the sidebar is selected
  var $el = $("a[href='" + path + "']", $element),
      $section = null

  if ($el.length) {
    $section = $el.parents(".docs-sidebar .section")
    $el.addClass("active");
  }

  // if the sidebar is in a tab, mark it's tab as active
  if ($section.length) {
    var name = $section.children(".name").first().text();
    activeTab = name;
  }

  $scope.active = function(name) {
    return name === activeTab;
  };

  $scope.show = function(name) {
    if (activeTab === name) {
      return activeTab = '';
    }

    activeTab = name;
  }
};
