export { LoadLayoutComponent } from './components';
export {
  LayoutDefaultComponent
} from './layout-default/layout-default.component';
export { NavbarDefaultComponent } from './layout-default';
export {
  LayoutCorpayandeComponent
} from './layout-corpayande/layout-corpayande.component';
export {
  LayoutTeatroJueteComponent
} from './layout-teatro-juete/layout-teatro-juete.component';
export {
  NavbarCorpayandeComponent,
  FooterCorpayandeComponent
} from './layout-corpayande';
export {
  NavbarTeatroJueteComponent,
  FooterTeatroJueteComponent
} from './layout-teatro-juete';

export const LAYOUTS: object = {
  default: true,
  corpayande: true,
  teatroJuete: true
};
