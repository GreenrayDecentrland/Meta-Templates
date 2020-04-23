
export class PackTemplate implements ISystem {
  META_ID = 0

  api = null
  host = null

  // Library of assets
  library = {
    'chair': {
      src: 'metas/packtemplate/models/model1.gltf',
      model: null
    },
    'table': {
      src: 'metas/packtemplate/models/model2.gltf',
      model: null
    },
    'vase': {
      src: 'metas/packtemplate/models/model3.gltf',
      model: null
    }
  }

  // List of loaded items as key value pairs
  items = {}

  /**
   * Initial scene setup, create all objects in the constructor.
   *
   * @param api          Used to call MetaZone API endpoints.
   * @param host_data    Very first
   */
  constructor(api, host_data) {
    // Save api
    this.api = api;


    // Note: your initial loading code goes here


    // Initial host data
    this.refreshHost(host_data)
  }

  /**
   * A Decentraland provided function where you should put your code that
   * repeats over and over.
   *
   * @param dt     Delta time since last update
   */
  update(dt: number) {
    // Note: your code that repeats goes here
  }

  /**
   * A MetaZone provided function that contains data customized by the
   * landowner on the MetaZone.io system. This gets called every minute when it
   * is deployed live. During testing its called once in the game.ts file.
   *
   * @param host_data    Data sent from the MetaZone backend to update your Meta
   */
  refreshHost(host_data) {
    // Save host info
    this.host = host_data

    // Parse metadata
    if(this.host.metadata) {
      let metadata = JSON.parse(this.host.metadata)

      //
      const keys = Object.keys(metadata)
      for(let i=0; i<keys.length; i++) {
        let metaItem = metadata[keys[i]];

        // Retrieve existing item
        if(this.items.hasOwnProperty(keys[i])) {
          log('Update Asset: ',metaItem)

          // Retrieve existing entity
          let itemEntity = this.items[keys[i]]
          // Position
          itemEntity.getComponent(Transform).position.set(metaItem.position.x,metaItem.position.y,metaItem.position.z)
          // Rotation
          itemEntity.getComponent(Transform).rotation.setEuler(metaItem.rotation.x,metaItem.rotation.y,metaItem.rotation.z)
          // Scale
          itemEntity.getComponent(Transform).scale.set(metaItem.bounds.width,metaItem.bounds.height,metaItem.bounds.depth)
        }
        // Create new item
        else if(this.library.hasOwnProperty(metaItem.type)) {
          log('Create Asset: ',metaItem)

          // No 3d model loaded yet
          if(!this.library[metaItem.type].model) {
            // Load the 3d model to asset library
            this.library[metaItem.type].model = new GLTFShape(this.library[metaItem.type].src)
          }

          // Create item
          let itemEntity = new Entity()
          itemEntity.addComponent(new Transform({
            position: new Vector3(metaItem.position.x,metaItem.position.y,metaItem.position.z),
            rotation: Quaternion.Euler(metaItem.rotation.x,metaItem.rotation.y,metaItem.rotation.z),
            scale: new Vector3(metaItem.bounds.width,metaItem.bounds.height,metaItem.bounds.depth)
          }))
          itemEntity.addComponent(this.library[metaItem.type].model)
          engine.addEntity(itemEntity)

          // Store as key value pair
          this.items[keys[i]] = itemEntity
        }
      }

    }

  }

}