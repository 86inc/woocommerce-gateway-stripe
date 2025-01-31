/**
 * External dependencies
 */
import React, { useEffect, useContext } from 'react';
import { render, waitFor } from '@testing-library/react';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */

import UpeToggleContextProvider from '../provider';
import UpeToggleContext from '../context';

jest.mock( '@wordpress/api-fetch', () => jest.fn() );

describe( 'UpeToggleContextProvider', () => {
	afterEach( () => {
		jest.clearAllMocks();

		apiFetch.mockResolvedValue( true );
	} );

	afterAll( () => {
		jest.restoreAllMocks();
	} );

	it( 'should render the initial state', () => {
		const childrenMock = jest.fn().mockReturnValue( null );
		render(
			<UpeToggleContextProvider>
				<UpeToggleContext.Consumer>
					{ childrenMock }
				</UpeToggleContext.Consumer>
			</UpeToggleContextProvider>
		);

		expect( childrenMock ).toHaveBeenCalledWith( {
			isUpeEnabled: false,
			setIsUpeEnabled: expect.any( Function ),
			status: 'resolved',
		} );
		expect( apiFetch ).not.toHaveBeenCalled();
	} );

	it( 'should render the initial state given a default value for isUpeEnabled', () => {
		const childrenMock = jest.fn().mockReturnValue( null );
		render(
			<UpeToggleContextProvider defaultIsUpeEnabled={ true }>
				<UpeToggleContext.Consumer>
					{ childrenMock }
				</UpeToggleContext.Consumer>
			</UpeToggleContextProvider>
		);

		expect( childrenMock ).toHaveBeenCalledWith(
			expect.objectContaining( {
				isUpeEnabled: true,
			} )
		);
		expect( apiFetch ).not.toHaveBeenCalled();
	} );

	it( 'should call the API and resolve when setIsUpeEnabled has been called', async () => {
		const childrenMock = jest.fn().mockReturnValue( null );

		const UpdateUpeDisabledFlagMock = () => {
			const { setIsUpeEnabled } = useContext( UpeToggleContext );
			useEffect( () => {
				setIsUpeEnabled( false );
			}, [ setIsUpeEnabled ] );

			return null;
		};

		render(
			<UpeToggleContextProvider defaultIsUpeEnabled>
				<UpdateUpeDisabledFlagMock />
				<UpeToggleContext.Consumer>
					{ childrenMock }
				</UpeToggleContext.Consumer>
			</UpeToggleContextProvider>
		);

		expect( childrenMock ).toHaveBeenCalledWith( {
			isUpeEnabled: true,
			setIsUpeEnabled: expect.any( Function ),
			status: 'resolved',
		} );

		expect( childrenMock ).toHaveBeenCalledWith( {
			isUpeEnabled: true,
			setIsUpeEnabled: expect.any( Function ),
			status: 'pending',
		} );

		await waitFor( () =>
			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wc/v3/wc_stripe/upe_flag_toggle',
				method: 'POST',
				// eslint-disable-next-line camelcase
				data: { is_upe_enabled: false },
			} )
		);

		await waitFor( () => expect( apiFetch ).toHaveReturned() );

		expect( childrenMock ).toHaveBeenCalledWith( {
			isUpeEnabled: false,
			setIsUpeEnabled: expect.any( Function ),
			status: 'resolved',
		} );
	} );
} );
