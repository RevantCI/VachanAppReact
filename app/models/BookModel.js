'use strict';

import Realm from 'realm'

export default class BookModel extends Realm.Object {}
BookModel.schema = {
    name: 'BookModel',
    properties: {
      sourceId:'int',
      bookId: 'string',
      bookName: 'string',
      chapters: 'ChapterModel[]',
      // bookmarksList: 'int?[]',
      section: {type: 'string', default: 'NT'},
      bookNumber: 'int',
      // bookOwner: {type: 'linkingObjects', objectType: 'VersionModel', property:'bookModels' }
    }
};
