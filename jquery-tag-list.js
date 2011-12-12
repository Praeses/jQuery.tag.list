(function($) {
  var settings = {};
  
  var selector = '';
  
  var private_methods = {
    initContainer: function(){
      var el = $(document.createElement('div'))
                .addClass('tag-list-wrapper');

      focusInput = function(){ $(this).find('.create').focus(); };

      el.bind('click', focusInput);

      return el;
    },

    initList: function(json){
      var list = $(document.createElement('ul'));
      if(json !== ''){
        $.each(JSON.parse(json), function(index,tag){
          list.append(private_methods.createItem(tag));
        });
      }

      return list;
    },

    initInput: function(){
      var input = $(document.createElement('input'))
                   .addClass('create')
                   .addClass('ui-autocomplete-input')
                   .attr('placeholder', settings.placeholder);

      input.bind('keydown',private_methods.onAddTag);

      window.tmp = input;
      return input;
    },

    createItem: function(tag){
      if( typeof tag !== 'object' ){
        tag = { id: 'new', label: tag };
      }

      var li    = $(document.createElement('li')).data('obj',tag);
      var label = $(document.createElement('span')).html(tag.label);
      var anch  = $(document.createElement('a')).html('x');
      
      anch.bind('click', private_methods.onRemoveTag);

      return li.append(label).append(anch);
    },
    
    onAddTag: function(event){
      if( event.keyCode === 13 ){
        var $this = $(this);
        var li = private_methods.createItem($.trim($this.val()));
        var list = $this.siblings('ul');
        list.append(li);
        $this.val('');
        $this.siblings(selector).trigger('change:add', li.data('obj'));
      }
    },

    onRemoveTag: function(){
      var li       = $(this).parent();
      var tag      = li.data('obj');
      var original = li.parent().siblings(selector);
      original.trigger('change:remove',tag);

      li.remove();
    },

    onChange: function(){
      var list = $(this).tagList('values');
      $(this).val(JSON.stringify(list));

      return this;
    }
    
  };

  var methods = {
    init: function(options){
      settings = $.extend({ 
        placeholder: 'Add Tag',
        onAdd: function(){},
        onRemove: function(){}
      }, options);

      selector = this.selector;

      return this.each(function(){
        var $this = $(this);
        $this.hide();

        var wrapper = private_methods.initContainer();
        var list    = private_methods.initList($this.val());
        var input   = private_methods.initInput();

        $this.wrapAll(wrapper);
        $this.parent().append(list).append(input);
        
        $this.bind('change:add', private_methods.onChange);
        $this.bind('change:remove', private_methods.onChange);

        $this.bind('change:add', settings.onAdd);
        $this.bind('change:remove', settings.onRemove);


      });
    },

    values: function(){
      // this == original input field
      var wrapper = $(this).parent();
      var list = $.map(wrapper.find('ul > li'),function(li){return $(li).data('obj');});
      return list;
    }

  };



  // inital tag-input def
  $.fn.tagList = function(method){
    if(methods[method]){
      return methods[method].apply(this, Array.prototype.slice.call(arguments,0));
    } else if( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' + method + ' does not exists on jQuery.tag-input' );
    }
  }
})(jQuery);
