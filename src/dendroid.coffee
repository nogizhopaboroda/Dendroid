'use strict'

namespace = if module? then module.exports else @

class Dendroid

  define_property: (object, key, value, enumerable = false) ->
    Object.defineProperty object, key,
      value: value
      enumerable: enumerable

  constructor: (object) ->

    if object instanceof Array
      collection = (Array.apply( [], object ) || [])
    else
      collection = (Object.apply( {}, object ) || {})

    @define_property(collection, 'listeners', [])

    @define_property(collection, 'watch', (callback) ->
      collection.listeners.push(callback)
      collection
    )

    @define_property(collection, 'to_json', -> JSON.stringify(collection))

    @define_property(collection, 'get_path', ->
      current = collection
      full_path = ''
      while current.parent?
        full_path = current.path + '.' + full_path
        current = current.parent
      full_path.replace(/\.$/, '')
    )

    for key, value of object

      collection[key] = value

      if typeof value is 'function'
        collection[key] = value

      else

        (=>
          [_value, _key] = [value, key]

          Object.defineProperty collection, key,
            set: (new_value) =>

              _backup_old_value = _value

              if typeof new_value is 'object'
                _value = namespace.Dendroid(new_value)
                @define_property(collection[key], 'path', key)
                @define_property(_value, 'parent', collection)
              else
                _value = new_value

              for listener in collection.listeners
                listener.call(collection, new_value, _backup_old_value, collection.get_path() + '.' + _key)
            get: ->
              _value
        )()

        if typeof value is 'object'
          collection[key] = namespace.Dendroid(value)
          @define_property(collection[key], 'path', key)

    return(collection)

namespace.Dendroid = (object) ->
  new Dendroid(JSON.parse(JSON.stringify(object)))

namespace.Dendroid.version = '0.1'

