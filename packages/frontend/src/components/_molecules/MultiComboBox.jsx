import { arrayOf, bool, func, string } from 'prop-types';
import { useCombobox, useMultipleSelection } from 'downshift';
import { useMemo, useState } from 'react';

function getFilteredValues(selectedItems, inputValue, allItems) {
  const lowerCasedInputValue = inputValue.toLowerCase();
  return allItems.filter((item) => {
    return (
      !selectedItems.includes(item) &&
      item.toLowerCase().includes(lowerCasedInputValue)
    );
  });
}

const MultipleComboBox = ({
  initialAllItems,
  initialSelectedItems = [],
  onChange,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const items = useMemo(
    () => getFilteredValues(selectedItems, inputValue, initialAllItems),
    [selectedItems, inputValue, initialAllItems]
  );
  const {
    getSelectedItemProps,
    getDropdownProps,
    // addSelectedItem,
    removeSelectedItem,
  } = useMultipleSelection({
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          setSelectedItems(newSelectedItems);
          onChange(newSelectedItems);
          break;
        default:
          break;
      }
    },
  });
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    itemToString(item) {
      return item || '';
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && {
              isOpen: true,
              highlightedIndex: 0,
            }),
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (!newSelectedItem && inputValue) {
            setSelectedItems([...selectedItems, inputValue]);
            onChange([...selectedItems, inputValue]);
          } else {
            setSelectedItems([...selectedItems, newSelectedItem]);
            onChange([...selectedItems, newSelectedItem]);
          }
          setInputValue('');
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue || '');

          break;
        default:
          break;
      }
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-1">
        <div className="shadow-sm bg-white inline-flex gap-2 items-center rounded-md flex-wrap p-1.5 border-2 focus-within:border-gray-400">
          {selectedItems.map(function renderSelectedItem(
            selectedItemForRender,
            index
          ) {
            return (
              <span
                className="bg-gray-100 rounded-md px-2 py-1 focus:bg-gray-200 text-sm"
                key={`selected-item-${index}`}
                {...getSelectedItemProps({
                  selectedItem: selectedItemForRender,
                  index,
                })}
              >
                {selectedItemForRender}
                <span
                  className="px-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedItem(selectedItemForRender);
                  }}
                >
                  &#10005;
                </span>
              </span>
            );
          })}
          <div className="flex gap-0.5 grow" {...getComboboxProps()}>
            <input
              placeholder="Type your skills"
              disabled={disabled}
              className="input input-ghost input-sm w-full focus:outline-none"
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
              value={inputValue}
            />
          </div>
        </div>
      </div>
      <ul
        {...getMenuProps()}
        className="absolute p-0 bg-white shadow-md max-h-80 overflow-scroll w-inherit rounded-md m-2"
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={
                (highlightedIndex === index ? 'bg-gray-100 ' : '') +
                (selectedItem === item ? 'font-bold ' : '') +
                'py-2 px-3 shadow-sm flex flex-col'
              }
              key={`${item.value}${index}`}
              {...getItemProps({ item, index })}
            >
              <span>{item}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

MultipleComboBox.propTypes = {
  initialAllItems: arrayOf(string).isRequired,
  initialSelectedItems: arrayOf(string),
  onChange: func.isRequired,
  disabled: bool.isRequire,
};

export default MultipleComboBox;
