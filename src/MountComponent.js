import Ractive from 'ractive';

const mountComponent = component => {
  // const ractive = new Ractive({

  // });
  return new Ractive(component);
};

export {
  mountComponent as default
}