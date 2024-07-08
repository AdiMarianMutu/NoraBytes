import { delay, skip } from 'rxjs';
import { Store, STORE_DEFAULT_VALUES } from './mocks';

describe('StoreContext.onChange', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const store = new Store();
  store.initStore(STORE_DEFAULT_VALUES);

  it(`should correctly invoke the 'onChange' callback`, (done) => {
    store.store.primitives.string.onChange(() => {
      done();
    });

    store.store.primitives.string.setValue('');
  });

  it(`should correctly invoke the 'onChange' callback with '1s' delay`, (done) => {
    store.store.primitives.string.onChange({
      with: [delay(1000)],
      do: () => {
        done();
      },
    });

    store.store.primitives.string.setValue('');
  }, 1100);

  it(`should correctly skip the first 3 value changes`, (done) => {
    store.store.primitives.number.onChange({
      with: [skip(3)],
      do: (value) => {
        if (value === 4) {
          done();
        } else {
          done('FAILED');
        }
      },
    });

    store.store.primitives.number.setValue((x) => x + 1);
    store.store.primitives.number.setValue((x) => x + 1);
    store.store.primitives.number.setValue((x) => x + 1);
    store.store.primitives.number.setValue((x) => x + 1);
  });
});
