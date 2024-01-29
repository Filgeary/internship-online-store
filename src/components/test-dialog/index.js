import {memo} from "react";
import PropTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import {Link} from "react-router-dom";
import Button from "@src/components/button";
import './style.css';
import Input from "../input";

function testDialog(props) {
  const cn = bem('testDialog');

  return (
    <div className={cn()}>
      {/*<p>{props.item.title}</p>*/}

      <div className={cn('item')}>
       Тестовый диалог
      </div>

      <div className={cn('buttons')}>
        <Button value='Отмена' onClick={props.onCancel} />
      </div>
    </div>
  );
}

testDialog.propTypes = {
  //sum: PropTypes.number,
  //t: PropTypes.func
};

testDialog.defaultProps = {
  //sum: 0,
  //t: (text) => text
}

export default memo(testDialog);
