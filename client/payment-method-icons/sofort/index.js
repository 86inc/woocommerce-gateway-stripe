/**
 * External dependencies
 */
import React from 'react';
import styled from '@emotion/styled';

/**
 * Internal dependencies
 */
import IconWithShell from '../styles/icon-with-shell';
import icon from './icon.svg';

const Wrapper = styled( IconWithShell )`
	background: #ef809f;
`;

const SofortIcon = ( props ) => <Wrapper { ...props } src={ icon } />;

export default SofortIcon;
