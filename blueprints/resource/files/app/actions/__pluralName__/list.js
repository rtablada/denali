import ApplicationAction from '../application';

export default class List<%= singular.className %> extends ApplicationAction {

  async respond() {
    let <%= singular.className %> = this.modelFor('<%= singular.dasherized %>');
    return <%= singular.className %>.find();
  }

}