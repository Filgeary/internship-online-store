import {memo} from "react";
import PropTypes from 'prop-types';
import useStateFork from "@src/hooks/use-state-fork";

function StateFork({ name, parent, options, removeOnExit, children }) {
  const isCreated = useStateFork(name, parent, options, removeOnExit);
  return isCreated && children;
}

StateFork.propTypes = {
  name: PropTypes.string,
  parent: PropTypes.string.isRequired,
  options: PropTypes.object,
  removeOnExit: PropTypes.bool,
  children: PropTypes.node,
};

StateFork.defaultProps = {
  options: {},
  removeOnExit: true,
}

export default memo(StateFork);
